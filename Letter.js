//       3
//   2       4
//       5
//   1       6
//       0

var NUM_SEGMENTS = 7
var SEGMENT_LENGTH = 6
var SEGMENTS = {
  'L': [1, 1, 1, 0, 0, 0, 0],
  'A': [0, 1, 1, 1, 1, 1, 1]
}

var Letter = function(letter, buffer, offset) {
  this._buffer = buffer
  this._offset = offset
  this._letter = letter
}

Letter.prototype.animate = function(func) {
  for(var segment = 0; segment < NUM_SEGMENTS; segment++) {
    var multiplier = SEGMENTS[this._letter][segment]

    if (multiplier === 0) {
      continue
    }

    for(var led = 0; led < SEGMENT_LENGTH; led++) {
      var offset = (segment * SEGMENT_LENGTH) + led + this._offset
      var colour = func(offset)

      this._buffer[offset] = ((colour.r * multiplier) << 16) + ((colour.g * multiplier) << 8) + (colour.b * multiplier)      
    }
  }
}

Letter.LED_COUNT = 42

module.exports = Letter
