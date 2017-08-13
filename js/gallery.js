jQuery(document).ready(function($){
  gallery_box();
});


function gallery_box(){

  // remove images from the gallery
  $('body').on('click', '.gallery_remove', function(e){
    e.preventDefault();
    var $this = $(this);
    $this.parent('li').html('');
  })

  // open the media library
  $('#post_format_gallery_add').on('click', function(event){
    event.preventDefault();

    gallery_media();
  })
}


function gallery_media() {

  var $gallery = $('#post_format_gallery_list');
  var $inputs = $gallery.find('li input');
  var images = [];
  $.each($inputs, function(k, v){
    images.push( $(v).val() );
  });


  // if the gallery has already been initialized then judt reopen it
  if(wp.media.frames.galleryBox){
    wp.media.frames.galleryBox.open();
    return;
  }

  // initialize media library in gallery mode
  wp.media.frames.galleryBox = wp.media({
    title: 'Gallery',
    button: { text: 'Select Images' },
    library: { type: 'image' },
    multiple: true,
    preSelection: images
  });

  // precheck images already in teh gallery
  wp.media.frames.galleryBox.on('open', function(){
    var selection = wp.media.frames.galleryBox.state().get('selection');
    images.forEach(function(image) {
      attachment = wp.media.attachment(image);
      attachment.fetch();
      selection.add( attachment ? [ attachment ] : [] );
    });
  });

  // when the images have been checked and the selected button is pressed..
  wp.media.frames.galleryBox.on('select', function(){
    selection = wp.media.frames.galleryBox.state().get('selection').toJSON();

    // for each selected image, throw it into the gallery_meta box
    for(var media_attachment_key in selection){
      media_attachment = selection[media_attachment_key];
      $gallery.append(
      '<li>\
        <img src="' + media_attachment.sizes.thumbnail.url + '" /><br />\
        <input type="hidden" name="post_format_gallery[]" value="' + media_attachment.id + '" />\
        <a href="#" class="gallery_remove">Remove</a>\
      </li>');
    }


  })

  // open the initialized media library
  wp.media.frames.galleryBox.open();
}
