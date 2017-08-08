jQuery(document).ready(function($){

  function image_box(){
    $('#post_format_image_select').on('click', function(event){
      event.preventDefault();

      if(wp.media.frames.imageBox){
        wp.media.frames.imageBox.open();
        return;
      }

      wp.media.frames.imageBox = wp.media({
        title: 'Image',
        button: { text: 'Select Image' },
        library: { type: 'image' },
        multiple: false
      })

      wp.media.frames.imageBox.on('select', function(){
        media_attachment = wp.media.frames.imageBox.state().get('selection').first().toJSON();
        $('#post_format_image_thumb').attr('src', media_attachment.sizes.thumbnail.url);
        $('#post_format_image').val(media_attachment.id);
      })

      wp.media.frames.imageBox.open();
    })
  }


});
