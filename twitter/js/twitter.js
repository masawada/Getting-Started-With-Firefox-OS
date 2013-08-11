// twitter.js

var Twitter = {};

Twitter.tweet = function(text, callback, error){
  var method = 'POST';
  uri = 'https://api.twitter.com/1.1/statuses/update.json';
  var con = HTTPClient({
    method: method,
    uri: uri
  });

  var post_data = {
    status: text
  };

  con.setOAuthHeader(Twitter.oauth.obtainOAuthParams(method, uri, post_data));

  con.onsuccess = callback;
  con.onerror = error;
  con.post_data = post_data;

  con.start();
};

Twitter.streaming = {};

Twitter.streaming.connection = null;

Twitter.streaming.start = function(callback, error){
  var method = 'GET';
  var uri = 'https://userstream.twitter.com/1.1/user.json';

  var con = HTTPClient({
    method: method,
    uri: uri
  });

  con.setOAuthHeader(Twitter.oauth.obtainOAuthParams(method, uri));

  con.onloading = function(xhr){
    var lines = xhr.responseText.split('\r\n');
    if(!lines[lines.length-2]){ return false; }
    callback(JSON.parse(lines[lines.length-2]));
  };
  con.onerror = error;

  con.start();
  Twitter.streaming.connection = con;
};

Twitter.streaming.stop = function(){
  Twitter.streaming.connection.stop();
  Twitter.streaming.connection = null;
};

Twitter.favorite = function(tweet_id, callback, error){
  var method = 'POST';
  uri = 'https://api.twitter.com/1.1/favorites/create.json';
  var con = HTTPClient({
    method: method,
    uri: uri
  });

  var post_data = {
    id: tweet_id
  };

  con.setOAuthHeader(Twitter.oauth.obtainOAuthParams(method, uri, post_data));

  con.onsuccess = callback;
  con.onerror = error;
  con.post_data = post_data;

  con.start();
};

