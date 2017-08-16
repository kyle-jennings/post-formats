jQuery(document).ready(function($){


  // when a URL is pasted in
  $('.post_format_url').on('change', function(e){
    e.preventDefault();
    var $this = $(this);
    var $metabox = $this.closest('.postbox');
    var url = $this.val();
    var format = $this.data('media');

    window['pfpAJAXMarkup'](url, format, $metabox);

  });


  // when the "remove image" link is clicked
  $('.pfp-js-remove-media').on('click', function(e){
    e.preventDefault();


    var $this = $(this);
    var $metabox = $this.closest('.postbox');

    $metabox.find('.pfp-media-holder').html('');
    $metabox.find('.post_format_url').val('');
    $metabox.find('.post_format_value').val('');
  });



  // open the media library
  $('.pfp-js-media-library').on('click', function(e){
    e.preventDefault();

    var $this = $(this);
    var format = $this.data('media');
    var $metabox = $this.closest('.postbox');
    var media = $metabox.find('.post_format_value').val();

    // if the media library is already created, open it
    if(wp.media.frames.mediaBox){
      wp.media.frames.mediaBox.open();
      return;
    }

    // initialize media library
    wp.media.frames.mediaBox = wp.media({
      title: format,
      button: { text: 'Select ' + format },
      library: { type: format },
      multiple: false
    })


    // when the media is selelected, set the values
    wp.media.frames.mediaBox.on('select', function(){
      media_attachment = wp.media.frames.mediaBox.state().get('selection').first().toJSON();

      var funcName = 'pfp' + titleCase(format) + 'Select';
      window[funcName](media_attachment, format, $metabox);

    })

    wp.media.frames.mediaBox.open();
  });

});


/**
 * set the image correctly
 * @param  {object} media_attachment the media object sent from the wp media library
 * @param  {string} format           what type of post format are we working with?
 * @param  {object} $metabox         jquery object/DOM element
 * @return {html}                  new DOM element to display the media
 */
function pfpImageSelect(media_attachment, format, $metabox){
  var $html = pfpAJAXMarkup(media_attachment.url, format, $metabox);

  $metabox.find('.post_format_url').val(media_attachment.url);
  $metabox.find('.post_format_value').val(media_attachment.url);

}


/**
 * set the video correctly
 * @param  {object} media_attachment the media object sent from the wp media library
 * @param  {string} format           what type of post format are we working with?
 * @param  {object} $metabox         jquery object/DOM element
 * @return {html}                  new DOM element to display the media
 */
function pfpVideoSelect(media_attachment, format, $metabox){
  var $html = pfpAJAXMarkup(media_attachment.url, format, $metabox);

  $metabox.find('.post_format_url').val(media_attachment.url);
  $metabox.find('.post_format_value').val(media_attachment.url);

}


/**
 * set the Audio correctly
 * @param  {object} media_attachment the media object sent from the wp media library
 * @param  {string} format           what type of post format are we working with?
 * @param  {object} $metabox         jquery object/DOM element
 * @return {html}                  new DOM element to display the media
 */
function pfpAudioSelect(media_attachment, format, $metabox){
  var $html = pfpAJAXMarkup(media_attachment.url, format, $metabox);

  $metabox.find('.post_format_url').val(media_attachment.url);
  $metabox.find('.post_format_value').val(media_attachment.url);

}



/**
 * AJAX the markup for the specified post format media type
 * @param  {string} url    [description]
 * @param  {string} format [description]
 *  * @param  {object} $metabox         jquery object/DOM element
 * @return {html}        [description]
 */
function pfpAJAXMarkup(url, format, $metabox){

  var data = {
    action: 'pfp_oembed',
    pfpURL: url,
    pfpType: format
  };

  jQuery.ajax({
    type: "POST",
    url: ajaxurl,
    data: data,
    complete: function(response){
      if(response.status == 200){

        var $html = response.responseText;
        if($html == ''){
          $metabox.find('.post_format_url').val('');
          $metabox.find('.post_format_value').val('');
        }
        $metabox.find('.pfp-media-holder').html( $html );

      }
    }
  });

}



function pfpSetValues(){

}

/**
 * Capitzalize a string
 * @param  {string} string the text string to capitalize
 * @return {string}        the capitalized text string
 */
function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
