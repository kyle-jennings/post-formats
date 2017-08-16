jQuery(document).ready(function($){
  gallery_box();
});


function gallery_box(){

  // remove images from the gallery
  $('body').on('click', '.gallery_remove', function(e){
    e.preventDefault();
    var $this = $(this);
    var $metabox = $this.closest('.postbox');
    $metabox.find('.pfp-shortcode-holder').html('');
  })

  // open the media library
  $('#post_format_gallery_add').on('click', function(event){
    event.preventDefault();
    var $this = $(this);
    var $metabox = $this.closest('.postbox');
    gallery_media($metabox);
  })
}


function gallery_media($metabox) {

  var images = $metabox.find('.post_format_value').val();
  images = images.split(',');
  // if the gallery has already been initialized then judt reopen it
  if(wp.media.frames.galleryBox){
    wp.media.frames.galleryBox.open();
    return;
  }

  // initialize media library in gallery mode
  wp.media.frames.galleryBox = wp.media({
    title: 'Gallery',
    library: { type: 'image' },
    multiple: true,
    toolbar: 'main-gallery',
    state: 'gallery-library',
    frame: 'post'
  });
    // button: { text: 'Select Images' },
    // preSelection: images,


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
  wp.media.frames.galleryBox.on('update', function(){
    selection = wp.media.frames.galleryBox.state().get('library');
    var str = '';
    var image_ids = [];
    selection.map( function( image ) {
      image_ids.push( image.id );
    });


    str = image_ids.join(',')
    $metabox.find('.post_format_value').val(str);

    pfpAJAXShortcode('[gallery link="none" ids="'+str+'"]', $metabox)
  })

  // open the initialized media library
  wp.media.frames.galleryBox.open();
}


function pfpAJAXShortcode(str,  $metabox){

  var data = {
    action: 'pfp_shortcode',
    pfpSTR: str
  };

  jQuery.ajax({
    type: "POST",
    url: ajaxurl,
    data: data,
    complete: function(response){
      if(response.status == 200){

        var $html = response.responseText;

        if($html == ''){
          $metabox.find('.post_format_value').val('');
        }else{
          $metabox.find('.pfp-shortcode-holder').html( $html );
        }

      }
    }
  });

}
