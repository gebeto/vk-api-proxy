// const http = require('http');

// //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
// var options = {
// 	host: 'httpbin.org',
// 	path: '/get'
// };

// // http.request(options, callback).end();

// http.createServer(function (req, res) {
// 	http.request(options, (response) => {
// 		res.pipe(response, {end: true});
// 		// res.end();
// 	});
// 	// req.pipe(response)
// 	// http.request(options, callback).end()	
// 	// console.log(http.request(options, callback))
// 	// res.write('Hello World!'); //write a response to the client
// 	// res.end(); //end the response
// }).listen(8080); //the server object listens on port 8080


const axios = require('axios');
const http = require('http');

http.createServer(onRequest).listen(process.env.PORT || 5000);

function onRequest(clientReq, clientRes) {
  console.log('serve: ' + clientReq.url);

  var options = {
    protocol: process.env.PROXY_PROTOCOL || 'https',
    hostname: process.env.PROXY_HOST || 'httpbin.org',
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers
  };

  const url = `${options.protocol}://${options.hostname}${options.path}`;
  // const url = `https://httpbin.org/get`;
  delete options.headers.host;

  axios.get(url, {
    responseType: 'stream',
    // method: options.method,
    headers: options.headers,
  }).then((res) => {
    clientRes.writeHead(res.status, res.headers);
    res.data.pipe(clientRes, { end: true });
  }).catch(err => {
    console.log("ERR:", url)
    clientRes.writeHead(404);
    clientRes.end();
  });
}