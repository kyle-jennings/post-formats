
jQuery(document).ready(function($){

  video_box($);
});


  function video_box($){
    
    //
    $('#post_format_video_select').on('click', function(e){
      e.preventDefault();
      openMediaLibVideos();
    });

    // clear that video and the url input if the remove video button is clicked
    $('.js--pfp-remove-video').on('click', function(e){
      e.preventDefault();

      $('.pfp-media-holder > *').attr('src', '' ).addClass('pfp-hide');
      $('#post_format_video').val('');
    });

    // update the video and url input when a URL is pasted in
    $('#post_format_video_url').on('change', function(e){
      e.preventDefault();
      var url = $(this).val();

      if( validateYouTubeUrl(url) ){
        $('#post_format_video').val(url);
        url = getYoutTubeID(url);
        $('.pfp-media-holder .pfp-embed').attr('src', 'https://www.youtube.com/embed/'+url ).removeClass('pfp-hide');
        $('.pfp-media-holder .pfp-video').attr('src', '' ).addClass('pfp-hide');

      } else {
        $('#post_format_video').val('');
        $('.pfp-media-holder > *').attr('src', '' ).addClass('pfp-hide');
      }

    });
  }

  // validates the URL is from YT
  function validateYouTubeUrl(url) {
      if (url != undefined || url != '') {
          var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
          var match = url.match(regExp);
          if (match && match[2].length == 11) {

            return true;
          }

          return false;
      }
  }

  // gets the YT id for the embed
  function getYoutTubeID(url) {
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');

    if(ampersandPosition != -1) {
      return video_id.substring(0, ampersandPosition);
    }

    return video_id;
  }



  function openMediaLibVideos() {
    if(wp.media.frames.videoBox){
      wp.media.frames.videoBox.open()
      return;
    }

    wp.media.frames.videoBox = wp.media({
      title: 'Video',
      button: { text: 'Select Video' },
      library: { type: 'Video' },
      multiple: false
    });

    wp.media.frames.videoBox.on('select', function(){
      media_attachment = wp.media.frames.videoBox.state().get('selection').first().toJSON()
      $('#post_format_video').val(media_attachment.url);
      $('.pfp-media-holder .pfp-embed').attr('src', '' ).addClass('pfp-hide');
      $('.pfp-media-holder .pfp-video').attr('src', media_attachment.url ).removeClass('pfp-hide');
    });

    wp.media.frames.videoBox.open();
  }
