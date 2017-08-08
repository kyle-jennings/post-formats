jQuery(document).ready(function($){
  gallery_box();
});


  function gallery_box(){
    $('.gallery_remove').on('click', function(){
      event.preventDefault();

      $($(this).parent('li')).html('');
    })

    $('#post_format_gallery_add').on('click', function(event){
      event.preventDefault();

      if(wp.media.frames.galleryBox){
        wp.media.frames.galleryBox.open();
        return;
      }

      wp.media.frames.galleryBox = wp.media({
        title: 'Gallery',
        button: { text: 'Select Image(s)' },
        library: { type: 'image' },
        multiple: true
      });

      wp.media.frames.galleryBox.on('select', function(){
        selection = wp.media.frames.galleryBox.state().get('selection').toJSON();

        for(var media_attachment_key in selection){
          media_attachment = selection[media_attachment_key];
          $('#post_format_gallery_list').append('<li>\
          <img src="' + media_attachment.sizes.thumbnail.url + '" /><br />\
          <input type="hidden" name="post_format_gallery[]" value="' + media_attachment.id + '" />\
          <a href="#" class="gallery_remove">Remove</a>\
          </li>');
        }

        $('.gallery_remove').on('click', function(){
          event.preventDefault();

          $($(this).parent('li')).html('');
        });
      })

      wp.media.frames.galleryBox.open();
    })
  }
