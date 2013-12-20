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
    options: options,
    collecting: false,
    data: options.addMethod === 'array'? []: {}
  }

}
exports.add = function(id, data, key) {
  console.log('ADDING', id, data);
  if (points[id].timeoutId) {
    clearTimeout(points[id].timeoutId);
  }
  if (points[id].options.addMethod === 'additionByKey') {
    console.log(points[id].data[data]);
    if (typeof points[id].data[data] === 'undefined') {
      points[id].data[data] = 0;
    }
    points[id].data[data]++;
  }
  else {
    points[id].data.push(data);
  }
  points[id].timeoutId = setTimeout(
    function(id) {
      send(id);
    }.bind(this, id),
    points[id].options.time || 5000
  );
}

var send = function(id) {
  console.log('sending', points[id].data);
  request({
    url: points[id].options.url,
    method: points[id].options.method || 'POST',
    data: points[id].data
  },
  function(err, res, data) {
    if (err) {
      throw err;
    }
    console.log('data sent');
  });
  points[id].data = [];
}
