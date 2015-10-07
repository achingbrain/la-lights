var strip = require('rpi-ws281x-native')
var Sign = require('./Sign')
var Microphone = require('./Microphone')
var Hapi = require('hapi')
var child_process = require('child_process')

var mic = new Microphone()
var sign = new Sign(mic)

var server = new Hapi.Server();
server.connection({ 
    host: '0.0.0.0',
    port: 8000
})
server.route({
  method: 'POST',
  path:'/api/mode',
  handler: function (request, reply) {
    if (request.payload.mode === 'ceremony') {
      sign.ceremonyMode(true)

      return reply(200)
    } else if (request.payload.mode === 'disco') {
      sign.ceremonyMode(false)

      return reply(200)
    }

    reply(400)
  }
})
server.route({
  method: 'POST',
  path:'/api/mic',
  handler: function (request, reply) {
    if (request.payload.mode === 'off') {
      mic.enabled(false)

      return reply(200)
    } else if (request.payload.mode === 'on') {
      mic.enabled(true)

      return reply(200)
    }

    reply(400)
  }
})
server.route({
  method: 'POST',
  path:'/api/animation/speed',
  handler: function (request, reply) {
    sign.animationSpeed(request.payload.value)
    reply(200)
  }
})
server.route({
  method: 'POST',
  path:'/api/animation/length',
  handler: function (request, reply) {
    sign.animationLength(request.payload.value)
    reply(200)
  }
})
server.route({
  method: 'POST',
  path:'/api/mic/gain',
  handler: function (request, reply) {
    mic.gain(request.payload.value)
    reply(200)
  }
})
server.route({
  method: 'POST',
  path:'/api/sign/brightness',
  handler: function (request, reply) {
    sign.brightness(request.payload.value)
    reply(200)
  }
})
server.route({
  method: 'POST',
  path:'/api/system/reboot',
  handler: function (request, reply) {
    child_process.exec('/sbin/reboot', function() {
      reply(200)
    })
  }
})
server.route({
  method: 'POST',
  path:'/api/system/shutdown',
  handler: function (request, reply) {
    child_process.exec('/sbin/init 0', function() {
      reply(200)
    })
  }
})
server.route({
  method: 'GET',
  path: '/js/jquery.min.js',
  handler: {
      file: 'node_modules/jquery/dist/jquery.min.js'
  }
})
server.route({
  method: 'GET',
  path: '/js/jquery.min.map',
  handler: {
      file: 'node_modules/jquery/dist/jquery.min.map'
  }
})
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
  }
})
server.start(function () {
  console.log('Server running at:', server.info.uri);
})
