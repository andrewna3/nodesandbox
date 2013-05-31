var Y = require("yui/yql");
function getKeyword() {
	var keyword = "";
	if(process.argv.length > 1) {
		keyword = process.argv[2];
	} 
	return keyword;
}

function capFirst(str) {
	return str? str.charAt(0).toUpperCase() + str.substring(1) : str;
}

var keyword = capFirst(getKeyword());

Y.YQL("select woeid from geo.places where text='"+keyword+"'", function(r) {
	try {
		console.log(r.query.results.place[0].woeid);
	} catch (e) {
		console.log("no woeid found for: "+keyword);
	}
});

