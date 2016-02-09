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
	if (newArray[countryCode[parsed.fullSuggestList[i].countryCode]] == undefined) {
	    newArray[countryCode[parsed.fullSuggestList[i].countryCode]] = new Array();
	}
	newArray[countryCode[parsed.fullSuggestList[i].countryCode]].push(parsed.fullSuggestList[i])
    }

    var keys = [],k, i, len;

    for (k in newArray) {
	if (newArray.hasOwnProperty(k)) {
	    keys.push(k);
	}
    }
    keys.sort();
    var ret = {};
    for (var i=0; i<keys.length; i++){
	ret[keys[i]] = newArray[keys[i]];
    }
    return ret;
}

exports.buildArrayDestination = function(destination) {
    var jsonString = requestSync("GET", 'https://www.airberlin.com/fr-FR/site/json/suggestAirport.php?searchfor=destinations&searchflightid=0&departures%5B%5D='+destination+'&destinations%5B%5D=&suggestsource%5B0%5D=activeairports&withcountries=0&withoutroutings=0&promotion%5Bid%5D=&promotion%5Btype%5D=&get_full_suggest_list=false&routesource%5B0%5D=airberlin&routesource%5B1%5D=partner').body.toString();
    var parsed = JSON.parse(jsonString);
    var newArray = new Object();
    for (var i=0; i<parsed.suggestList.length; i++) {
	if (newArray[countryCode[parsed.suggestList[i].countryCode]] == undefined) {
	    newArray[countryCode[parsed.suggestList[i].countryCode]] = new Array();
	}
	newArray[countryCode[parsed.suggestList[i].countryCode]].push(parsed.suggestList[i])
    }

    var keys = [],k, i, len;

    for (k in newArray) {
	if (newArray.hasOwnProperty(k)) {
	    keys.push(k);
	}
    }
    keys.sort();
    var ret = {};
    for (var i=0; i<keys.length; i++){
	ret[keys[i]] = newArray[keys[i]];
    }


    return ret;
}


exports.getSID = function(departure, destination, outboundDate, returnDate, adultCount, childCount, infantCount, destletter, departletter) {

/*
/////////////////////////////////////////



    var bodyString = "market=FR"
        +"&"+"language=fr"
        +"&"+"bookingmask_widget_id:bookingmask-widget-stageoffer"
        +"&"+"bookingmask_widget_dateformat=dd/mm/yy"
        +"&"+"departure="+departletter
        +"&"+"destination="+destletter
        +"&"+"outboundDate=04/02/2016"
        +"&"+"returnDate=17/02/2016"
        +"&"+"adultCount="+adultCount
        +"&"+"childCount="+childCount
        +"&"+"infantCount="+infantCount
        +"&"+"submitSearch=";

    var requestData = {
	url: "https://www.airberlin.com/fr-FR/site/start.php",                            // endpoint url
	body: bodyString,
	headers:{
	    "User-agent"    : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
	    "Referer"       : "https://www.airberlin.com/fr-FR/site/start.php",
	    "pragma"        : "no-cache"
	},
//	jar: cookieJar
    };

    requestt.post(requestData, function(error, response, body){
	console.log(response);
    })
	




*/    

    var sid = "";///////////////////////////////////////
    var response = request('https://www.airberlin.com/fr-FR/booking/flight/vacancy.php?departure='+departure+'destination='+destination+'&outboundDate='+outboundDate+'&returnDate='+returnDate+'&oneway=0&openDateOverview=0&adultCount='+adultCount+'&childCount='+childCount+'&infantCount='+infantCount, {method: 'GET'});
    console.log(response);
    var string = response.headers["location"];
    var rePattern = new RegExp(/sid=(.{20})/);
    var arrMatches = string.match(rePattern);
    var cookie = buildCookie(response.headers["set-cookie"]);
    console.log("DATE : "+outboundDate);
    test(arrMatches[1], cookie, destletter, departletter, outboundDate, returnDate);
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

function test(sid, cookie, destletter, departletter, outbounddate, returndate) {
//    console.log("COOKIE : "+cookie);
    console.log(cookie.split(";"));
//    var sid = "6a5755a7d4545eeeefe4";
    var cookie = cookie.split(";")[0];
//    var cookie = "ABSESS=ges95scv9q6k2nqj2a5uukh934; ";/*PHPSESSID=m34cmu5945lgahdqbd4fnfs012; remember=1%3Bfr%3BFR; _dc_gtm_UA-35638432-1=1; _gat_UA-35638432-1=1; startConnection=LON%40PAR%402016-02-04%402016-02-17; mmcore.tst=0.244; mmid=1804592959%7CDAAAAArNl24++QwAAA%3D%3D; mmcore.pd=-327999327%7CDAAAAAoBQs2Xbj75DB6ACuwCAOsZb6OpLdNIDwAAAOiQeZqdLdNIAAAAAP//////////AAZEaXJlY3QB+QwCAAAAAAAAAAAAAP///////////////wEA+DMAAECUesEh+QwA/////wH5DPkM//8MAAABcmaCQAELrQAAkt4AAAAAAAABRQ%3D%3D; mmcore.srv=ldnvwcgeu10; _ga=GA1.2.958867395.1454615957; lst=1454621176";*/

    var bodyString = "_ajax[templates][]=dateoverview"
    "&_ajax[templates][]=main"
    "&_ajax[templates][]=priceoverview"
    "&_ajax[templates][]=infos"
    "&_ajax[templates][]=flightinfo"
    "&_ajax[requestParams][departure]="+departletter
    "&_ajax[requestParams][destination]="+destletter
    "&_ajax[requestParams][returnDeparture]="
    "&_ajax[requestParams][returnDestination]="
    "&_ajax[requestParams][outboundDate]="+outbounddate
    "&_ajax[requestParams][returnDate]="+returndate
    "&_ajax[requestParams][adultCount]=1"
    "&_ajax[requestParams][childCount]=0"
    "&_ajax[requestParams][infantCount]=0"
    "&_ajax[requestParams][openDateOverview]="
    "&_ajax[requestParams][oneway]=1";
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
	var object = JSON.parse(response.body);
	console.log("abc");
	console.log(object);
	console.log(object["templates"]["dateoverview"]);
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


var countryCode = {"BD":"Bangladesh","BE":"Belgium","BF":"Burkina Faso","BG":"Bulgaria","BA":"Bosnia and Herzegovina","BB":"Barbados","WF":"Wallis and Futuna","BL":"Saint Barthelemy","BM":"Bermuda","BN":"Brunei","BO":"Bolivia","BH":"Bahrain","BI":"Burundi","BJ":"Benin","BT":"Bhutan","JM":"Jamaica","BV":"Bouvet Island","BW":"Botswana","WS":"Samoa","BQ":"Bonaire, Saint Eustatius and Saba ","BR":"Brazil","BS":"Bahamas","JE":"Jersey","BY":"Belarus","BZ":"Belize","RU":"Russia","RW":"Rwanda","RS":"Serbia","TL":"East Timor","RE":"Reunion","TM":"Turkmenistan","TJ":"Tajikistan","RO":"Romania","TK":"Tokelau","GW":"Guinea-Bissau","GU":"Guam","GT":"Guatemala","GS":"South Georgia and the South Sandwich Islands","GR":"Greece","GQ":"Equatorial Guinea","GP":"Guadeloupe","JP":"Japan","GY":"Guyana","GG":"Guernsey","GF":"French Guiana","GE":"Georgia","GD":"Grenada","GB":"United Kingdom","GA":"Gabon","SV":"El Salvador","GN":"Guinea","GM":"Gambia","GL":"Greenland","GI":"Gibraltar","GH":"Ghana","OM":"Oman","TN":"Tunisia","JO":"Jordan","HR":"Croatia","HT":"Haiti","HU":"Hungary","HK":"Hong Kong","HN":"Honduras","HM":"Heard Island and McDonald Islands","VE":"Venezuela","PR":"Puerto Rico","PS":"Palestinian Territory","PW":"Palau","PT":"Portugal","SJ":"Svalbard and Jan Mayen","PY":"Paraguay","IQ":"Iraq","PA":"Panama","PF":"French Polynesia","PG":"Papua New Guinea","PE":"Peru","PK":"Pakistan","PH":"Philippines","PN":"Pitcairn","PL":"Poland","PM":"Saint Pierre and Miquelon","ZM":"Zambia","EH":"Western Sahara","EE":"Estonia","EG":"Egypt","ZA":"South Africa","EC":"Ecuador","IT":"Italy","VN":"Vietnam","SB":"Solomon Islands","ET":"Ethiopia","SO":"Somalia","ZW":"Zimbabwe","SA":"Saudi Arabia","ES":"Spain","ER":"Eritrea","ME":"Montenegro","MD":"Moldova","MG":"Madagascar","MF":"Saint Martin","MA":"Morocco","MC":"Monaco","UZ":"Uzbekistan","MM":"Myanmar","ML":"Mali","MO":"Macao","MN":"Mongolia","MH":"Marshall Islands","MK":"Macedonia","MU":"Mauritius","MT":"Malta","MW":"Malawi","MV":"Maldives","MQ":"Martinique","MP":"Northern Mariana Islands","MS":"Montserrat","MR":"Mauritania","IM":"Isle of Man","UG":"Uganda","TZ":"Tanzania","MY":"Malaysia","MX":"Mexico","IL":"Israel","FR":"France","IO":"British Indian Ocean Territory","SH":"Saint Helena","FI":"Finland","FJ":"Fiji","FK":"Falkland Islands","FM":"Micronesia","FO":"Faroe Islands","NI":"Nicaragua","NL":"Netherlands","NO":"Norway","NA":"Namibia","VU":"Vanuatu","NC":"New Caledonia","NE":"Niger","NF":"Norfolk Island","NG":"Nigeria","NZ":"New Zealand","NP":"Nepal","NR":"Nauru","NU":"Niue","CK":"Cook Islands","XK":"Kosovo","CI":"Ivory Coast","CH":"Switzerland","CO":"Colombia","CN":"China","CM":"Cameroon","CL":"Chile","CC":"Cocos Islands","CA":"Canada","CG":"Republic of the Congo","CF":"Central African Republic","CD":"Democratic Republic of the Congo","CZ":"Czech Republic","CY":"Cyprus","CX":"Christmas Island","CR":"Costa Rica","CW":"Curacao","CV":"Cape Verde","CU":"Cuba","SZ":"Swaziland","SY":"Syria","SX":"Sint Maarten","KG":"Kyrgyzstan","KE":"Kenya","SS":"South Sudan","SR":"Suriname","KI":"Kiribati","KH":"Cambodia","KN":"Saint Kitts and Nevis","KM":"Comoros","ST":"Sao Tome and Principe","SK":"Slovakia","KR":"South Korea","SI":"Slovenia","KP":"North Korea","KW":"Kuwait","SN":"Senegal","SM":"San Marino","SL":"Sierra Leone","SC":"Seychelles","KZ":"Kazakhstan","KY":"Cayman Islands","SG":"Singapore","SE":"Sweden","SD":"Sudan","DO":"Dominican Republic","DM":"Dominica","DJ":"Djibouti","DK":"Denmark","VG":"British Virgin Islands","DE":"Germany","YE":"Yemen","DZ":"Algeria","US":"United States","UY":"Uruguay","YT":"Mayotte","UM":"United States Minor Outlying Islands","LB":"Lebanon","LC":"Saint Lucia","LA":"Laos","TV":"Tuvalu","TW":"Taiwan","TT":"Trinidad and Tobago","TR":"Turkey","LK":"Sri Lanka","LI":"Liechtenstein","LV":"Latvia","TO":"Tonga","LT":"Lithuania","LU":"Luxembourg","LR":"Liberia","LS":"Lesotho","TH":"Thailand","TF":"French Southern Territories","TG":"Togo","TD":"Chad","TC":"Turks and Caicos Islands","LY":"Libya","VA":"Vatican","VC":"Saint Vincent and the Grenadines","AE":"United Arab Emirates","AD":"Andorra","AG":"Antigua and Barbuda","AF":"Afghanistan","AI":"Anguilla","VI":"U.S. Virgin Islands","IS":"Iceland","IR":"Iran","AM":"Armenia","AL":"Albania","AO":"Angola","AQ":"Antarctica","AS":"American Samoa","AR":"Argentina","AU":"Australia","AT":"Austria","AW":"Aruba","IN":"India","AX":"Aland Islands","AZ":"Azerbaijan","IE":"Ireland","ID":"Indonesia","UA":"Ukraine","QA":"Qatar","MZ":"Mozambique"}
