jQuery(document).ready(function($){

  function audio_box(){
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
        $('#post_format_audio').val(media_attachment.id)
        $('#post_formats_audio_preview').attr('src', media_attachment.url)
      });

      wp.media.frames.audioBox.open();
    });

    $('.js--pfp-remove-audio').on('click', function(e){
      e.preventDefault();
      $('#post_formats_audio_preview').attr('src', null);
    });
  }

});
