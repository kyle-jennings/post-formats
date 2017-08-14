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
                'normal',
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

        $i = 0;
        ?>
        <ul class="chat-log cf" id="post_format_chat_list">
            <?php foreach($chat as $line): ?>
                <li>
                    <div>
                        Name:
                        <input type="text" name="post_format_chat[<?php echo($i); ?>][author]" value="<?php echo($line['author']); ?>" placeholder="Author" />
                    </div>
                    <div>
                        Message:
                        <textarea name="post_format_chat[<?php echo($i); ?>][body]"><?php echo($line['body']); ?></textarea>
                    </div>
                </li>
            <?php $i++; endforeach; ?>
        </ul>

        <div>
            <script type="text/javascript">
            window.postFormatsNextChat = <?php echo($i); ?>;
            </script>
            <input type="button" value="<?php _e('Add Chat Line', 'post_formats'); ?>" id="post_format_chat_add" />
        </div>
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
