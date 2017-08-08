jQuery(document).ready(function($){

  function chat_box(){
    $('#post_format_chat_add').on('click', function(event){
      event.preventDefault();

      $('#post_format_chat_list').append('<li>\
        <input type="text" name="post_format_chat[' + window.postFormatsNextChat + '][author]" value="" placeholder="Author" /><br />\
        Message: <br />\
        <textarea name="post_format_chat[' + window.postFormatsNextChat + '][body]"></textarea>\
      </li>');
      window.postFormatsNextChat += 1;
    });
  }


});
