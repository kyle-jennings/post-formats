<?php

class PostFormatChat
{

    public $screens = array();

    public function __construct($screens = array())
    {
        $this->screens = $screens;
    }


    public function register_chat(){
        foreach($this->screens as $screen){
            add_meta_box(
                'post_formats_chat',
                __('Chat', 'post-formats'),
                array($this, 'chat_meta_box'),
                $screen,
                'top',
                'default'
            );
        }
    }

    public function chat_meta_box($post){
        wp_nonce_field('post_format_chat_nonce', 'post_format_chat_nonce');
        $chat = get_post_meta($post->ID, '_post_format_chat', true);

        if(!$chat){
            $chat = array();
        }
    ?>
        <div class="chat-log cf" id="post_format_chat_log"></div>
    <?php
    }

    public function chat_meta_box_save($post_id){
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'post_format_chat_nonce' ]) && wp_verify_nonce($_POST['post_format_chat_nonce'], 'post_format_chat_nonce')) ? 'true' : 'false';

        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        if(isset($_POST['post_format_chat'])){
            print_r($_POST['post_format_chat']);
            update_post_meta($post_id, '_post_format_chat', $_POST['post_format_chat']);
        }else{
            delete_post_meta($post_id, '_post_format_chat');

        }
    }

}
