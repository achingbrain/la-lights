var Mcp3008 = require('mcp3008.js')
var adc = new Mcp3008()
var channel = 0
var map = require('map-range')(function (x) { return x }, 0, 768, 0.2, 1)
var Barcli = require("barcli");

var graph = {
  value: new Barcli({
    label: 'Value',
    range: [0, 1024]
  }),
  gain: new Barcli({
    label: 'Gain',
    range: [1, 10]
  }),
  level: new Barcli({
    label: 'Level',
    range: [0, 1]
  })
}

var Microphone = function () {
  this._adc = new Mcp3008()
  this._channel = 0
  this.level = 1
  this._gain = 1
}

Microphone.prototype.enabled = function (enabled) {
  console.info('Microphone', enabled ? 'enabled' : 'disabled')

  if (enabled) {
    this._listen()
  } else {
    clearImmediate(this._immediate)
    this._immediate = null
    this.level = 1
  }
}

Microphone.prototype.gain = function (gain) {
  console.info('gain', gain)

  this._gain = parseInt(gain, 10)
}

Microphone.prototype._listen = function () {
  if (this._immediate) {
    return
  }

  var read = function() {
    adc.read(channel, function (value) {
      graph.value.update(value)
      graph.gain.update(this._gain)

      value *= this._gain
      value = Math.min(value, 1023)

      this.level = map(value)

      graph.level.update(this.level)

      this._immediate = setImmediate(read)
    }.bind(this))
  }.bind(this)

  this._immediate = setImmediate(read)
}

module.exports = Microphone
