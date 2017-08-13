jQuery(document).ready(function($){

  audio_box();

});


function audio_box() {

  $('#post_format_audio_select').on('click', function(event){
    event.preventDefault();

    if(wp.media.frames.audioBox){
      wp.media.frames.audioBox.open();
      return;
    }

    wp.media.frames.audioBox = wp.media({
      title: 'Audio',
      button: { text: 'Select Audio' },
      library: { type: 'audio' },
      multiple: false
    });

    wp.media.frames.audioBox.on('select', function(){
      media_attachment = wp.media.frames.audioBox.state().get('selection').first().toJSON()

      $('#post_format_audio').val(media_attachment.url);
      pfpGetAudioMarkup(media_attachment.url);
    });

    wp.media.frames.audioBox.open();
  });


  $('.js--pfp-remove-audio').on('click', function(e){
    e.preventDefault();
    $('.pfp-audio-holder .audio-player__player').attr('src','');
    $('#post_format_audio, #post_format_audio_url').val('');
  });



}



function pfpGetAudioMarkup(url){

  jQuery.ajax({
    type: "POST",
    url: ajaxurl,
    data: { action: 'pfp_oembed' , pfpURL: url, pfpType: 'audio' },
    complete: function(response){
      if(response.status == 200){
        var $html = response.responseText;

        $('#post_format_audio, #post_format_audio_url').val(url);
        $('.pfp-audio-holder').html($html);
      }
    }
  });

}
