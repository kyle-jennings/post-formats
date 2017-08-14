console.log('chat');

jQuery(document).ready(function($){

  var chat = {};


    $('#post_format_chat_add').on('click', function(e){
      e.preventDefault();
      console.log('boom');

      var $html = '<li>\
        <div> \
          Name: \
          <input type="text" name="post_format_chat[' + window.postFormatsNextChat + '][author]" value="" placeholder="Author" />\
        </div> \
        <div> \
          Message: \
          <textarea name="post_format_chat[' + window.postFormatsNextChat + '][body]"></textarea>\
        </div> \
      </li>';

      $('#post_format_chat_list').append($html);
      window.postFormatsNextChat += 1;
    });



});
