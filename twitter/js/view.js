var View = {};

View.showTweetPanel = function(){
  $('#main_panel').removeClass('current');
  $('#tweet_panel').addClass('current');
  $('#tweet_text').focus();
};

View.hideTweetPanel = function(){
  $('#tweet_panel').removeClass('current');
  $('#main_panel').addClass('current');
};

View.createTweet = function(callback, tweet){
  // callback: onclick
  var li = $('<li></li>').addClass('tweet').attr('id', 'status_'+tweet.id_str);
  var icon = $('<p></p>').addClass('tweet_icon').append($('<img>').attr('src', tweet.user.profile_image_url).attr('alt', '').addClass('tweet_icon_img'));
  var user = $('<p></p>').addClass('tweet_user').text(tweet.user.screen_name);
  var text = $('<p></p>').addClass('tweet_text').text(tweet.text);
  var date = $('<date></date>').addClass('tweet_date').text(View.formatDate(tweet.created_at));

  li.append(icon).append(user).append(text).append(date);
  li.on('click', function(e){callback(e);});
  $('#timeline').prepend(li);
};

View.formatDate = function(str){
  var d = new Date(str);
  return (
    d.getFullYear()+'/'+
    ('00' + (d.getMonth()+1)).slice(-2)+'/'+
    ('00' + d.getDate()).slice(-2)+' '+
    ('00' + d.getHours()).slice(-2)+':'+
    ('00' + d.getMinutes()).slice(-2)+':'+
    ('00' + d.getSeconds()).slice(-2)
  );
};

