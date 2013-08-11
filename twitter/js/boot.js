$(function(){
  Twitter.oauth = OAuth({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token: access_token,
    access_token_secret: access_token_secret
  });

  $('#show_tweet_panel').on('click',View.showTweetPanel);
  $('#cancel').on('click',View.hideTweetPanel);
  $('#tweet').on('click', function(){
    var tweet = $('#tweet_text').val();
    if(tweet.length === 0){ return false; }
    Twitter.tweet(tweet, function(){
      $('#tweet_text').val('');
      View.hideTweetPanel();
    },
    function(){
      alert('tweet update error');
    });
  });

  var streaming_callback = function(tweet){
    if(tweet.delete){return false;}
    if(!tweet.user){return false;}
    View.createTweet(function(e){
      var id = e.currentTarget.id.match(/[0-9]+/);
      Twitter.favorite(id, function(){}, function(){alert('favorite error');});
    }, tweet);
  };
  
  var streaming_start = function(){
    Twitter.streaming.start(streaming_callback, function(){});
  };

  $('#start').on('click', function(e){
    if(Twitter.streaming.connection === null){
      streaming_start();
      $('#start').text('Stop');
    }else{
      Twitter.streaming.stop();
      $('#start').text('Start');
    }
  });

  streaming_start();
});
