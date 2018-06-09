var Kinect2 = require('kinect2'); //change to 'kinect2' in a project of your own
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const zlib = require('zlib');
const fs = require('fs');

var kinect = new Kinect2();

if (kinect.open()) {
  server.listen(8000);
  console.log('Server listening on port 8000');
  console.log('Point your browser to http://localhost:8000');

  app.use(express.static(__dirname + '/public'));

  var compressing = false;
  kinect.on('depthFrame', function (data) {
    //compress the depth data using zlib
    if (!compressing) {
      compressing = true;
      zlib.deflate(data, function (err, result) {
        if (!err) {
          var buffer = result.toString('base64');
          io.sockets.sockets.forEach(function (socket) {
            socket.volatile.emit('depthFrame', buffer);
          });
        }
        compressing = false;
      });
    }
  });

  kinect.openDepthReader();
}
