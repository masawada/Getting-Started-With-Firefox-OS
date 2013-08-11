// oauth.js

var OAuth = function Class(args){
  if(!(this instanceof Class)){ return new Class(args); }
  if(!args){ args = {}; }

  this.base_uri = args.uri;
  this.consumer_key = args.consumer_key;
  this.consumer_secret = args.consumer_secret;
  this.access_token = args.access_token;
  this.access_token_secret = args.access_token_secret;

  this.oauth_token = '';
  this.oauth_token_secret = '';
};

(function(){
var proto = OAuth.prototype;

proto.obtainOAuthParams = function(method, uri, post_data){
  var params = {
    oauth_consumer_key: this.consumer_key,
    oauth_nonce: this.generateNonce(32),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor((new Date())/1000)),
    oauth_token: this.access_token,
    oauth_version: '1.0'
  };

  params.oauth_signature = this.generateSignature(method, uri, Util.mergeHash(params, post_data), this.access_token_secret);

  return params;
};

proto.generateNonce = function(length){
  var seed_str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      seed = seed_str.split(''),
      i,
      nonce = '';

  for(i=0;i<length;i++){
    nonce += seed[Math.floor(Math.random() * 61)];
  }

  return nonce;
};

proto.generateSignature = function(method, uri, params, oauth_secret){
  // create base string
  var key_array = [], key, i, l, base_string, sorted_params;

  base_string = method.toUpperCase() + '&' + Util.uri_encode(uri) + '&';

  for(key in params){
    if(params.hasOwnProperty(key)){
      key_array[key_array.length] = key;
    }
  }
  key_array.sort();
  l = key_array.length;

  sorted_params = [];
  for(i=0;i<l;i++){
    sorted_params[sorted_params.length] = (key_array[i] + '=' + Util.uri_encode(params[key_array[i]]));
  }
  base_string += Util.uri_encode(sorted_params.join('&'));

  // get hmac
  if(!oauth_secret){
    oauth_secret = '';
  }

  var shaObj = new jsSHA(base_string, 'TEXT');
  var secret_key = this.consumer_secret + '&' + oauth_secret;
  return Util.uri_encode(shaObj.getHMAC(secret_key, 'TEXT', 'SHA-1', 'B64'));
};

}());

