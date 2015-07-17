var paramifyString = function(str, params, mod) {
  mod = str;
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      mod = params[param](str);
      if (mod !== str) { 
        break; 
      }
    }
  }
  return mod === str ? '([._a-zA-Z0-9-%()]+)' : mod;
}

var regifyString = function(str, params) {
  var matches;
  var last = 0;
  var out = '';
  while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
    last = matches.index + matches[0].length;
    matches[0] = matches[0].replace(/^\*/, '([_\.\(\)!\\ %@&a-zA-Z0-9-]+)');
    out += str.substr(0, matches.index) + matches[0];
  }
  str = out += str.substr(last);
  var captures = str.match(/:([^\/]+)/ig);
  var capture;
  var length;
  if (captures) {
    length = captures.length;
    for (var i = 0; i < length; i++) {
      capture = captures[i];
      if ( capture.slice(0, 2) === "::" ) {
        // This parameter was escaped and should be left in the url as a literal
        // Remove the escaping : from the beginning
        str = capture.slice( 1 );
      } 
      else {
        str = str.replace(capture, paramifyString(capture, params));
      }
    }
  }
  return {
    str: str,
    captures: captures
  };
}

var didFire = false;

var get = function(route, handler) {
  if (didFire) {
    return;
  }
  var searchString = window.location.search;
  var query = {};
  searchString.replace(
    new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
    function( $0, $1, $2, $3 ){
      query[ $1 ] = $3;
    }
  );
  var path = window.location.pathname;
  var routeLength = 0;
  var handler;
  var handlerMatch;
  var handlerCaptures;
  var regEx = regifyString(route);
  var match = path.match(regEx.str);
  if (match) {
    handlerMatch = match;
    handlerCaptures = regEx.captures || [];
  }
  if (handler) {
    var params = {};
    handlerCaptures.forEach(function(cap, i) {
      params[cap.replace(":","")] = handlerMatch[i + 1];
    });
    var req = {
      params: params,
      query: query
    }
    var res = {
      setHeader: function() {}
    };
    didFire = true;
    handler(req, res);
  }
}

module.exports = get;