var strip = require('rpi-ws281x-native')
var Letter = require('./Letter')
var Plus = require('./Plus')
var animations = [
  require('./animations/rainbow'),
  require('./animations/crawl'),
  require('./animations/rainbowCrawl'),
  require('./animations/wipe'),
  require('./animations/wipeBackground.js'),
  require('./animations/flash'),
  require('./animations/rainbowFlash')
]

process.on('SIGINT', function() {
  strip.reset()
  process.nextTick(function() {
    process.exit(0)
  })
})

var Sign = function(mic) {
  var numLeds = 93
  strip.init(numLeds)

  this._mic = mic
  this._components = []
  this._buffer = new Uint32Array(numLeds)

  var offset = 0

  this._components.push(new Letter('L', this._buffer, offset))
  offset += Letter.LED_COUNT
  this._components.push(new Plus(this._buffer, offset))
  offset += Plus.LED_COUNT
  this._components.push(new Letter('A', this._buffer, offset))
  offset += Letter.LED_COUNT

  this._animationSpeed = 100
  this._animationLength = 10000
  this._brightness = 1

  this.ceremonyMode(true)
  this.chooseAnimation()
  this.animate()
}

Sign.prototype.brightness = function (brightness) {
  console.info('Brightness', brightness)
  this._brightness = parseFloat(brightness)
}

Sign.prototype.ceremonyMode = function (enabled) {
  console.info('Ceremony mode', enabled ? 'enabled' : 'disabled')
  this._ceremony = enabled ? true : false
  this.chooseAnimation()
}

Sign.prototype.animationSpeed = function (speed) {
  console.info('animation speed', speed)
  this._animationSpeed = parseInt(speed, 10)
}

Sign.prototype.animationLength = function (length) {
  console.info('animation length', length)
  this._animationLength = parseInt(length, 10)
  this.chooseAnimation()
}

Sign.prototype.chooseAnimation = function () {
  clearTimeout(this._chooseAnimationTimeout)

  if (this._ceremony) {
    this._animationFunction = this.brightnessAffected.bind(this, this.white.bind(this))
  } else {
    var func = animations[Math.floor(Math.random() * animations.length)]

    this._animationFunction = this.brightnessAffected.bind(this, this.micAffected.bind(this, func))
  }

  this._chooseAnimationTimeout = setTimeout(this.chooseAnimation.bind(this), this._animationLength)
}

Sign.prototype.animate = function () {
  this._components.forEach(function(component) {
    component.animate(this._animationFunction)
  }.bind(this))

  strip.render(this._buffer)

  setTimeout(this.animate.bind(this), this._animationSpeed)
}

Sign.prototype.white = function () {
  return {
    r: 255,
    g: 255,
    b: 255
  }
}

Sign.prototype.brightnessAffected = function (func, pin) {
  var colour = func(pin)

  return {
    r: colour.r * this._brightness,
    g: colour.g * this._brightness,
    b: colour.b * this._brightness
  }
}

Sign.prototype.micAffected = function (func, pin) {
  var colour = func(pin)

  return {
    r: colour.r * this._mic.level,
    g: colour.g * this._mic.level,
    b: colour.b * this._mic.level
  }
}

module.exports = Sign
