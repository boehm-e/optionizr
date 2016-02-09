//var request = require("request");
var request = require('request');
var requestt =require('request-sync');
var requestSync = require('request-sync');
var cookieJar = request.jar();
var express = require('express');
var app = express();
var fs = require('fs');
var req = require("request");
var https = require("https");
var getPicture = require("google-image-search-url-results");
// COOKIES
var cookieJar = request.jar();



// optionizr modules
var optionizr = require("./optionizr_modules/optionizr.js");

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/picture/:depart/:destination', function(req,res) {
    var pictureDep = req.param('depart');
    var pictureDes = req.param('destination');
    res.send(getPicture(pictureDep, pictureDes));
});

app.get('/departure', function (req, res) {
    res.send(optionizr.buildArrayDeparture());
});

app.get('/destination/:destination', function (req, res) {
    var destination = req.param('destination');
    res.send(optionizr.buildArrayDestination(destination));
});

app.get('/getsid/:departure/:destination/:outbounddate/:returndate/:adultcount/:childcount/:infantcount/:destletter/:departletter/:oneway', function(req, res) {
    // GET PARAMS FROM REQUEST 
    var departure = req.param('departure'), 
	destination = req.param('destination'),
	outbounddate = req.param('outbounddate'),
	returndate = req.param('returndate'),
	adultcount = req.param('adultcount'),
	childcount = req.param('childcount'),
	infantcount = req.param('infantcount'),
	destletter = req.param('destletter'),
	departletter = req.param('departletter'),
	oneway = req.param('oneway');

    if (oneway == "true") {
	oneway = "1";
	returndate = outbounddate;
    } else {
	oneway = "";
    }
    var response = requestt('https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?departure=' + departure + '&destination=' + destination + '&outboundDate=' + outbounddate + '&returnDate=' + outbounddate + '&oneway='+oneway+'&openDateOverview=0&adultCount=' + adultcount + '&childCount=0&infantCount=0', {method: 'GET'});
    var string = response.headers["location"];
    var rePattern = new RegExp(/sid=(.{20})/);
    var arrMatches = string.match(rePattern);
    var cookie = buildCookieString(response.headers["set-cookie"]);
    retrieveAirBerlinFlightList(res, arrMatches[1], cookie, departure, destination, outbounddate, returndate, adultcount, childcount, infantcount, oneway);
});

function retrieveAirBerlinFlightList(res, sid, cookie, departure, destination, outbounddate, returndate, adultcount, childcount, infantcount, oneway) {
    var bodyString = "_ajax[templates][]=dateoverview"+
	"&_ajax[templates][]=main"+
	"&_ajax[templates][]=priceoverview"+
	"&_ajax[templates][]=infos"+
	"&_ajax[templates][]=flightinfo"+
	"&_ajax[requestParams][departure]=" + departure +
	"&_ajax[requestParams][destination]=" + destination +
	"&_ajax[requestParams][returnDeparture]=" +
	"&_ajax[requestParams][returnDestination]=" +
	"&_ajax[requestParams][outboundDate]=" + outbounddate +
	"&_ajax[requestParams][returnDate]=" + outbounddate +
	"&_ajax[requestParams][adultCount]=" + adultcount +
	"&_ajax[requestParams][childCount]="+ childcount +
	"&_ajax[requestParams][infantCount]="+ infantcount +
	"&_ajax[requestParams][openDateOverview]="+
	"&_ajax[requestParams][oneway]="+ oneway;
    var requestData = {
	url: "https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?sid=" + sid,
	body: bodyString,  // body data
	headers: {
	    //http headers"
	    "Content-Type": "application/x-www-form-urlencoded", // content type (form)
	    "User-agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0", // simulate browser
	    "Cookie": cookie,
	    "Referer": "https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?sid=" + sid // simulate request comes from airFrance
	},
	cookieString: cookie
    };

    request.post(requestData, function (error, response, body) {
	var full_body = JSON.parse(response.body);
	var content = full_body["templates"]["main"];
	var response = parseData(content);
	res.send(response);
    });
};


function parseData(html) {
    var string = html;
    console.log(html);
    var reg = /<tr class="(flightrow|flightrow selected)">([^`]*?)<\/tr>/g
    var resultAllFlights = [], found;

    while (found = reg.exec(string)) {
	resultAllFlights.push(found[0]);
    }
    console.log("SIZE : "+resultAllFlights.length);

    var finalObject = {};
    finalObject['outbound'] = {};
    finalObject['return'] = {};

    var out = 0;
    var ret = 0;
    for (i in resultAllFlights) {
	var ft = flightType(resultAllFlights[i].toString());
	if (ft == "outbound") {
	    finalObject['outbound'][out] = flightInformations(resultAllFlights[i]);
	    out++;
	} else if (ft == "return") {
	    finalObject['return'][ret] = flightInformations(resultAllFlights[i]);
	    ret++;
	}
    }
   
    return orderObject(finalObject);
}

function testOutbound(outbound, type, i, j, abc) {
    var k;
    for (k in abc["outbound"][i]["faretype"]) {
	//	    console.log(abc["outbound"][i]["faretype"][k], type[j]);
	if (abc["outbound"][i]["faretype"][k] == type[j]) {
	    return abc["outbound"][i]["prices"][k];
	}
    }
    return "-";
}

function testReturn(outbound, type, i, j, abc) {
    var k;
    for (k in abc["return"][i]["faretype"]) {
	//	    console.log(abc["return"][i]["faretype"][k], type[j]);
	if (abc["return"][i]["faretype"][k] == type[j]) {
	    return abc["return"][i]["prices"][k];
	}
    }
    return "-";
}

function orderObject(object) {
    console.log(JSON.stringify(object));
    var abc = object;
    var type = ["BASE", "EASY", "COMF", "PREM"];
    var finalTabOutbound = {};
    var finalTabReturn = {};


    for (var i=0; abc["outbound"][i] != undefined; i++) {
	finalTabOutbound[i] = [];
	var k;
	for (j in type) {
	    finalTabOutbound[i].push(testOutbound(k, type, i,j, abc));
	}
    }

    for (var i=0; abc["return"][i] != undefined; i++) {
	finalTabReturn[i] = [];
	var k;
	for (j in type) {
	    finalTabReturn[i].push(testReturn(k, type, i,j, abc));
	}
    }
    
    for (i=0; object["outbound"][i] != undefined; i++) {
	object["outbound"][i]["prices"] = finalTabOutbound[i];
    }
    for (i=0; object["return"][i] != undefined; i++) {
	object["return"][i]["prices"] = finalTabReturn[i];
    }
    
    return object;
 }


function flightInformations(string) {
    var array = {};
    var found;
    // GET PRICES
    array["prices"] = [];
    var reg = /<span id="price-.{13}">(.{0,10})<\/span>/g
    var i = 0;
    while (found = reg.exec(string)) {
	if (!isOdd(i))
	    array["prices"].push(found[1]);
	i++;
    }

    // GET HORAIRES
    array["time"] = [];
    var reg = /<time>(.{3,10})<\/time>/g
    var i = 0;
    while (found = reg.exec(string)) {
	array["time"].push(found[1]);
	i++;
    }

    // GET ESCALES
    array["stop"] = [];
    var reg = /<td>(.{1})<\/td>/g
    var i = 0;
    while (found = reg.exec(string)) {
	array["stop"].push(found[1]);
	i++;
    }

    // GET FLIGHT ID
    array["flightid"] = [];
    var reg = /<input type="hidden" name="flightid" value="([^`]*?)"\/>/g
    var i = 0;
    while (found = reg.exec(string)) {
	array["flightid"].push(found[1]);
	i++;
    }

    // FAREINDEX
    array["fareindex"] = [];
    var reg = /<input type="hidden" name="flightdetailsreference" value="([^`]*?)"\/>/g
    var i = 0;
    while (found = reg.exec(string)) {
	array["fareindex"].push(found[1]);
	i++;
    }

    // FAREGROUP
    array["fareindex"] = [];
    var reg = /<input type="hidden" name="faregroup" value="([^`]*?)"\/>/g
    var i = 0;
    while (found = reg.exec(string)) {
	array["fareindex"].push(found[1]);
	i++;
    }

    // FARETYPE
    array["faretype"] = [];
    var reg = /<input type="hidden" name="faretype" value="([^`]*?)"\/>/g
    var i = 0;
    while (found = reg.exec(string)) {
	array["faretype"].push(found[1]);
	i++;
    }	
    
    return array;
}

function isOdd(num) {return num % 2;}

function flightType(string) {
    var reg = /(outboundFareId)/g
    var resultOutbound = [], found;
    while (found = reg.exec(string)) {
	resultOutbound.push(found[0]);
    }

    var reg = /(returnFareId)/g
    var resultReturn = [], found;
    while (found = reg.exec(string)) {
	resultReturn.push(found[0]);
    }


    if (resultOutbound.length > 0)
	return "outbound";
    else if (resultReturn.lengt > 0)
	return "return";
    else return "fail";
}


function buildCookieString(array) {
    var value = "";
    if (!array) return "";

    var first = true;
    for (var i = 0; i < array.length; i++) {
	var cv = array[i];
	var sp = cv.split(";");
	if (sp && sp.length >= 1) {
	    if (!first)
		value += " ";
	    value += sp[0] + ";";
	    first = false;
	}
    }
    return value;
};


function isOdd(num) {return num % 2;}

function flightType(string) {
    var reg = /(outboundFareId)/g
    var resultOutbound = [], found;
    while (found = reg.exec(string)) {
	return "outbound";
    }

    var reg = /(returnFareId)/g
    var resultReturn = [], found;
    while (found = reg.exec(string)) {
	return "return";
    }
    return "fail";
}

function buildCookie(array) {
    var value = "";
    if(!array) return "";
    
    var first = true;
    for(var i = 0; i < array.length; i++)
    {
	var cv = array[i].toString();
	var sp = cv.split(";");
	if(sp && sp.length >= 1)
	{
	    if(!first)
		value += " ";
	    value += sp[0]+";";
	    first = false;
	}
    }
    return value;
};

app.get('/', function(req, res) {
    res.end(fs.readFileSync('./views/index.ejs', 'utf-8'));
});

app.listen(3000, function () {
    console.log('listening on port 3000');
});
