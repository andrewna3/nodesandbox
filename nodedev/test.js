var sys = require("sys");
var http = require("http");
var url = require("url");
var cp = require("child_process");
var handle = [];

handle["/sleep"] = function(response) {
	function sleep(milliseconds) {
		var startTime = new Date().getTime();
		while(new Date().getTime() < startTime + milliseconds);		
	}
	sleep(10000);
	console.log("start");
	response.writeHeader(200, {"Content-Type": "text/plain"});
        response.write("start");
	response.end();
};

handle["/"] = function (response) {
        response.writeHeader(200, {"Content-Type": "text/plain"});
        response.write("Welcome to my first node.js server");
        response.end();
};
handle["/upload"] = function (response) {
	console.log("upload");
        response.writeHeader(200, {"Content-Type": "text/plain"});
        response.write("upload");
	response.end();
};

handle["/woeid"] = function(response, params) {
 	function showWeather(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(stdout);
		response.end();
	}
	
	console.log("looking up woeid for " + params);
	cp.exec("node woeid.js \""+decodeURIComponent(params)+"\"", showWeather);	
}

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
        	console.log("Request for "+ pathname + " received.");
		route(pathname, handle, response);
	        //response.writeHeader(200, {"Content-Type": "text/plain"});
	        //response.write("Hello World");
	}

	http.createServer(onRequest).listen(8080);
}

function route(pathname,handle,response) {
	var myname = arguments.callee.name;
	console.log(myname+": "+"About to route a request for "+pathname);

	if (pathname.match(/\/woeid\/?/)) {
		var wparams = "";
		var weatherparams = pathname.match(/\/woeid\/?(.*)/);
		console.log(weatherparams.length);
		if(weatherparams.length > 1) {
			wparams = weatherparams[1];
		}
		handle["/woeid"](response, wparams);
	} else  if (typeof handle[pathname] === 'function') {
                handle[pathname](response);
	} else {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Invalid path");
		response.end();
		console.log(myname+": "+"No request handler found for "+pathname);
	}
}

start(route, handle);
console.log("Server Running on 8080");
