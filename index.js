var request = require('request');
var points = {};

exports.addPoint = function(id, options) {
  if (typeof points[id] !== 'undefined') {
    return true;
  }
  if (typeof options.url === 'undefined') {
    throw new Error('You need to pass an url to send data to');
  }
  options.addMethod = options.addMethod || 'array';
  points[id] = {
    collectin: false,
    options: options,
    collecting: false,
    data: options.addMethod === 'array'? []: {}
  }

}
exports.add = function(id, data, key) {
  if (points[id].options.addMethod === 'additionByKey') {
    if (typeof points[id].data[data] === 'undefined') {
      points[id].data[data] = 0;
    }
    points[id].data[data]++;
  }
  else {
    points[id].data.push(data);
  }
  if (!points[id].collecting) {
    points[id].collecting = true;
    points[id].timeoutId = setTimeout(
      function(id) {
        send(id);
      }.bind(this, id),
      points[id].options.time || 5000
    );
  }
}
exports.subtract = function(id, data) {
  if (points[id].options.addMethod === 'additionByKey') {
    if (typeof points[id].data[data] === 'undefined') {
      points[id].data[data] = 0;
    }
    points[id].data[data] -= 1;
  }
  if (!points[id].collecting) {
    points[id].collecting = true;
    points[id].timeoutId = setTimeout(
      function(id) {
        send(id);
      }.bind(this, id),
      points[id].options.time || 5000
    );
  }
}

var send = function(id) {
  points[id].collecting = false;
  request({
    url: points[id].options.url,
    method: points[id].options.method || 'POST',
    json: true,
    body: points[id].data
  },
  function(err, res, data) {
    if (err) {
      console.log('Error when trying to call url', points[id].options.url);
    }
  });
  points[id].data = points[id].options.addMethod === 'array'? []: {}
}
