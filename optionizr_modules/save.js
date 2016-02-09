var requestSync = require('sync-request');
var request = require('request-sync');
var requestt = require('request');
var moment              = require("moment");

var https = require("https");
exports.buildArrayDeparture = function() {
    var jsonString = requestSync("GET", "https://www.airberlin.com/fr-FR/site/json/suggestAirport.php?searchfor=departures&searchflightid=0&departures%5B%5D=&destinations%5B%5D=Johannesburg&suggestsource%5B0%5D=activeairports&withcountries=0&withoutroutings=0&promotion%5Bid%5D=&promotion%5Btype%5D=&get_full_suggest_list=true&routesource%5B0%5D=airberlin&routesource%5B1%5D=partner").body.toString();
    var parsed = JSON.parse(jsonString);
    var newArray = new Object();
    for (var i=0; i<parsed.fullSuggestList.length; i++) {
	if (newArray[parsed.fullSuggestList[i].countryCode] == undefined) {
	    newArray[parsed.fullSuggestList[i].countryCode] = new Array();
	}
	newArray[parsed.fullSuggestList[i].countryCode].push(parsed.fullSuggestList[i])
    }
    return newArray;
}

exports.buildArrayDestination = function(destination) {
    var jsonString = requestSync("GET", 'https://www.airberlin.com/fr-FR/site/json/suggestAirport.php?searchfor=destinations&searchflightid=0&departures%5B%5D='+destination+'&destinations%5B%5D=&suggestsource%5B0%5D=activeairports&withcountries=0&withoutroutings=0&promotion%5Bid%5D=&promotion%5Btype%5D=&get_full_suggest_list=false&routesource%5B0%5D=airberlin&routesource%5B1%5D=partner').body.toString();
    var parsed = JSON.parse(jsonString);
    var newArray = new Object();
    for (var i=0; i<parsed.suggestList.length; i++) {
	if (newArray[parsed.suggestList[i].countryCode] == undefined) {
	    newArray[parsed.suggestList[i].countryCode] = new Array();
	}
	newArray[parsed.suggestList[i].countryCode].push(parsed.suggestList[i])
    }
    return newArray;
}


exports.getSID = function(departure, destination, outboundDate, returnDate, adultCount, childCount, infantCount, destletter, departletter) {
    var sid = "";
    var response = request('https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?departure='+departure+'destination='+destination+'&outboundDate='+outboundDate+'&returnDate='+returnDate+'&oneway=0&openDateOverview=0&adultCount='+adultCount+'&childCount='+childCount+'&infantCount='+infantCount, {method: 'GET'});
    console.log(response);
    var string = response.headers["location"];
    var rePattern = new RegExp(/sid=(.{20})/);
    var arrMatches = string.match(rePattern);
    var cookie = buildCookie(response.headers["set-cookie"]);
    test(arrMatches[1], cookie, destletter, departletter);
//    getSomething(sid);
    return arrMatches[1];
}

//console.log(getSomething());

function getSomething(sid) {
//    console.log("URL : https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?sid="+sid);
    var data = request('https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?sid='+sid, {method: 'GET'});
    console.log(data);
    console.log(data);
    return data;
}

function test(sid, cookie, destletter, departletter) {
    console.log("COOKIE : "+cookie);
    var sid = "593859d1789a3a8b1c9f";
    var cookie = "remember=1%3Bfr%3BFR; ABSESS=l8bd5m71psld35p14n6gonm0t7; PHPSESSID=gpckh016djb86bt00c4in1mge6; startConnection=PAR%40LON%402016-02-06%402016-02-26; mmcore.tst=0.703; mmid=-1776669376%7CnAAAAApibG8c9wwAAA%3D%3D; mmcore.pd=-797917373%7CnAAAAAoBQmJsbxz3DGOkoeYWAAFETR2aLdNIDwAAALfpQWnWK9NIAAAAAP//////////AAZEaXJlY3QB9wwWAAAAAAAAAAAAAP///////////////wEA+DMAAI8AAAABRQ%3D%3D; mmcore.srv=ldnvwcgeu07; _dc_gtm_UA-35638432-1=1; _gat_UA-35638432-1=1; _ga=GA1.2.1829697715.1454420451; lst=1454614462";

    var bodyString = "_ajax[templates][]=dateoverview"
    "&_ajax[templates][]=main"
    "&_ajax[templates][]=priceoverview"
    "&_ajax[templates][]=infos"
    "&_ajax[templates][]=flightinfo"
    "&_ajax[requestParams][departure]="+departletter
    "&_ajax[requestParams][destination]="+destletter
    "&_ajax[requestParams][returnDeparture]="
    "&_ajax[requestParams][returnDestination]="
    "&_ajax[requestParams][outboundDate]=2016-02-25"
    "&_ajax[requestParams][returnDate]=2016-02-27"
    "&_ajax[requestParams][adultCount]=1"
    "&_ajax[requestParams][childCount]=0"
    "&_ajax[requestParams][infantCount]=0"
    "&_ajax[requestParams][openDateOverview]="
    "&_ajax[requestParams][oneway]=";
    var requestData = {
	url: "https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?sid="+sid,
	body: bodyString,  // body data
	headers:{
	    //http headers
	    "Content-Type" : "application/x-www-form-urlencoded", // content type (form)
	    "User-agent" : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0", // simulate browser
	    "Cookie" : cookie,
	    "Referer" : "https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?sid="+sid // simulate request comes from airFrance
	},
	cookieString: cookie
    };

    requestt.post(requestData, function(error, response, body){
//	console.log("error", error);
//	console.log("response", JSON.parse(response.body));
	var object = JSON.parse(response.body);
	console.log("abc");
	console.log(object);
	console.log(object["templates"]["dateoverview"]);
//	console.log("body", body);
    });
}


function buildCookie(array) {
    var value = "";
    if(!array) return "";

    var first = true;
    for(var i = 0; i < array.length; i++)
    {
	var cv = array[i];
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
