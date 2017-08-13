
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

    $('.pfp-video-holder').html('' );
    $('#post_format_video, #post_format_video_url').val('');
  });

  // update the video and url input when a URL is pasted in
  $('#post_format_video_url').on('change', function(e){
    e.preventDefault();
    var url = $(this).val();
    pfpGetVideoMarkup(url);

  });


}


function pfpGetVideoMarkup(url){

  jQuery.ajax({
    type: "POST",
    url: ajaxurl,
    data: { action: 'pfp_oembed' , pfpURL: url, pfpType: 'video' },
    complete: function(response){
      if(response.status == 200){
        var $html = response.responseText;
        // console.log(url);
        $('#post_format_video').val(url);
        $('.pfp-video-holder').html($html);
      }
    }
  });

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
    $('#post_format_video, #post_format_video_url').val(media_attachment.url);
    pfpGetVideoMarkup(media_attachment.url);
  });

  wp.media.frames.videoBox.open();
}
