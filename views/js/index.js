$.get( "/departure", function( data ) {
    $.each(data, function(key, value) {
	$('#departure')
	    .append($("<option disabled></option>")
		    .text(key));
	for (var i=0; i<value.length; i++) {
	    $('#departure')
	        .append($("<option></option>")
			.attr("value", value[i].code)
			.text(value[i].name));
	}
    });
    initMaterialize();
});


var prev = "";
$('#departure').on('change', function() {
    $("#destination").empty();
    $.get( "/destination/"+$("#departure").val(), function( data ) {
	$.each(data, function(key, value) {	    
	    $('#destination')
		    .append($("<option disabled></option>")
			    .text(key));
	    for (var i=0; i<value.length; i++) {
		$('#destination')
		    .append($("<option></option>")
			    .attr("value", value[i].code)
			    .text(value[i].name));
	    }
	});
	initMaterialize();
    });
    
});

for(var i=0; i<10; i++) {
    $('#adultcount').append($("<option></option>").attr("value", i).text(i));
    $('#childcount').append($("<option></option>").attr("value", i).text(i));
    $('#infantcount').append($("<option></option>").attr("value", i).text(i));
}
$("#adultcount").val(1);

// initialize materializecss

function initMaterialize() {
    $('.datepicker').pickadate({
	selectMonths: true, // Creates a dropdown to control month
	selectYears: 15 // Creates a dropdown of 15 years to control year
    });
    $('select').material_select();
}


$("#search").click(function(){
    var departure = $("#departure").val();
    var destination = $("#destination").val();
    var outbounddate = new Date($("#outbounddate").val()).toLocaleString('en-GB').split(' ')[0].split('/').reverse().join('-').replace(',', '');
    var returndate = new Date($("#returndate").val()).toLocaleString('en-GB').split(' ')[0].split('/').reverse().join('-').replace(',', '');
    var adultcount = $("#adultcount").val();
    var childcount = $("#childcount").val();
    var infantcount = $("#infantcount").val();
    var destletter = $( "#destination option:selected" ).text();
    var departletter = $( "#departure option:selected" ).text();
    console.log(departure, destination, outbounddate, returndate, adultcount, childcount, infantcount, destletter, departletter);
    if (departure != null && destination != null && outbounddate != "" && returndate != "") {
	enableLoading();
	$.get( "/getSid/"+departure+"/"+destination+"/"+outbounddate+"/"+returndate+"/"+adultcount+"/"+childcount+"/"+infantcount+"/"+destletter+"/"+departletter, function( data ) {
	    console.log(data);

	    // OUTBOUND

	    $.get("/picture/"+destletter, function(pics) {
		var picture = pics;
		var i = 0;
		$("body").append('<div class="listview"><p class="flightType">Depart</p></div>');
		$("body").append('<div id="scroll" class="listview row"><span class="col-xs-2 start">start</span><span class="col-xs-2 end">time</span><span class="col-xs-2 stops">Escale</span></span><span class="col-xs-2 flydeal">flyDeal</span><span class="col-xs-2 flyclassic">flyClassic</span><span class="col-xs-2 flyflex">flyFlex</span></div>')
		while (data["outbound"][i] != undefined) {
		    $("body").append('<div class="listview row"><span class="cardView"><div class="row"> <div class=""> <div class="card medium"> <div class="card-image"><span class="closeCard">X</span><img src="'+picture[(Math.round(Math.random() * (picture.length)))]+'"> <span class="card-title">Card Title</span> </div> <div class="card-content" style=" margin-top: -10px; "> <span class="col-xs-2 start">'+data['outbound'][i]["time"][0]+'</span><span class="col-xs-2 end">'+data['outbound'][i]["time"][1]+'</span><span class="col-xs-2 stops">'+data['outbound'][i]["stop"][0]+'</span><span class="col-xs-2 flydeal">'+data['outbound'][i]["prices"][0]+'</span><span class="col-xs-2 flyclassic">'+data['outbound'][i]["prices"][1]+'</span><span class="col-xs-2 flyflex">'+data['outbound'][i]["prices"][2]+'</span> </div> <div class="card-action"> <a href="#">BOOK</a> </div> </div> </div> </div></span>');
		i++;
		}
		
		// RETURN
		var i = 0;
		$("body").append('<div class="listview"><p class="flightType">Arrivee</p></div>');
		$("body").append('<div class="listview row"><span class="col-xs-2 start">start</span><span class="col-xs-2 end">time</span><span class="col-xs-2 stops">Escale</span></span><span class="col-xs-2 flydeal">flyDeal</span><span class="col-xs-2 flyclassic">flyClassic</span><span class="col-xs-2 flyflex">flyFlex</span></div>')
		while (data["return"][i] != undefined) {
		    $("body").append('<div class="listview row"><span class="cardView"><div class="row"> <div class=""> <div class="card medium"> <div class="card-image"><span class="closeCard">X</span><img src="'+picture[(Math.round(Math.random() * (picture.length)))]+'"> <span class="card-title">Card Title</span> </div> <div class="card-content" style=" margin-top: -10px; "> <span class="col-xs-2 start">'+data['return'][i]["time"][0]+'</span><span class="col-xs-2 end">'+data['return'][i]["time"][1]+'</span><span class="col-xs-2 stops">'+data['return'][i]["stop"][0]+'</span><span class="col-xs-2 flydeal">'+data['return'][i]["prices"][0]+'</span><span class="col-xs-2 flyclassic">'+data['return'][i]["prices"][1]+'</span><span class="col-xs-2 flyflex">'+data['return'][i]["prices"][2]+'</span> </div> <div class="card-action"> <a href="#">BOOK</a> </div> </div> </div> </div></span>');

		    i++;
		}
		disableLoading();
	    })

	})
    }
    else
	alert("empty fields");
})

function enableLoading() {
    $("#loading").removeClass("disableLoading").addClass("enableLoading");
}

function disableLoading() {
    $("#loading").removeClass("enableLoading").addClass("disableLoading");
    $("html,body").animate({ scrollTop: $($(".listview")[1]).offset().top }, "slow");
    $(".card-content").click(function() {
	$($(this.parentNode.parentNode).find(".medium")[0]).attr("style", "height:400px !important");
	$($(this.parentNode.parentNode).find(".card-image")[0]).attr("style", "height:400px !important");
	$($(this.parentNode.parentNode).find(".card-action")[0]).attr("style", "display: block !important");
    });

    $(".closeCard").click(function() {
	$($(this.parentNode.parentNode.parentNode.parentNode).find(".medium")[0]).attr("style", "height:0px !important");
	$($(this.parentNode.parentNode.parentNode.parentNode).find(".card-image")[0]).attr("style", "height:0px !important");
	$($(this.parentNode.parentNode.parentNode.parentNode).find(".card-action")[0]).attr("style", "display: none !important");
    });
    $(".card .card-image img").attr("style", "top: -50%");
}
    



function getCC(code) {
    var json = {"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"};

    return json[code];
}

