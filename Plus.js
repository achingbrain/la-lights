var Plus = function(buffer, offset) {
  this._buffer = buffer
  this._offset = offset
}

Plus.prototype.animate = function(func) {
  for(var led = 0; led < Plus.LED_COUNT; led++) {
    var offset = led + this._offset
    var colour = func(offset)

    this._buffer[offset] = (colour.r << 16) + (colour.g << 8) + colour.b
  }
}

Plus.LED_COUNT = 9

module.exports = Plus
