<?php

class PostFormatAside
{
    public $screens = array();

    public function __construct($screens = array())
    {
        $this->screens = $screens;
    }

    public function register_aside(){
        foreach($this->screens as $screen){
            add_meta_box(
                'post_formats_aside',
                __('Quote', 'post-formats'),
                array($this, 'aside_meta_box'),
                $screen,
                'normal',
                'default'
            );
        }
    }


    public function aside_meta_box($post){
        wp_nonce_field('post_format_aside_nonce', 'post_format_aside_nonce');
        $asideAuthor = get_post_meta($post->ID, '_post_format_aside_author', true);
        $asideBody = get_post_meta($post->ID, '_post_format_aside_body', true);
        ?>
        <p>
            <label>
                <?php _e('Quote Author', 'post_formats'); ?><br />
                <input type="text" value="<?php echo($asideAuthor); ?>" name="post_format_aside_author" />
            </label>
        </p>
        <p>
            <label>
                <?php _e('Quote Body', 'post_formats'); ?><br />
                <textarea name="post_format_aside_body"><?php echo($asideBody); ?></textarea>
            </label>
        </p>
        <?php
    }

    public function aside_meta_box_save($post_id){
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'post_format_aside_nonce' ]) && wp_verify_nonce($_POST['post_format_aside_nonce'], 'post_format_aside_nonce')) ? 'true' : 'false';

        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        if(isset($_POST['post_format_aside_author'])){
            update_post_meta($post_id, '_post_format_aside_author', $_POST['post_format_aside_author']);
        }

        if(isset($_POST['post_format_aside_body'])){
            update_post_meta($post_id, '_post_format_aside_body', $_POST['post_format_aside_body']);
        }
    }

}
