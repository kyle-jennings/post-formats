<?php

class PostFormatGallery{

    public $screens = array();

    public function __construct($screens = array())
    {
        $this->screens = $screens;
    }


    public function register_gallery(){
        foreach($this->screens as $screen){
            add_meta_box(
                'post_formats_gallery',
                __('Gallery', 'post-formats'),
                array($this, 'gallery_meta_box'),
                $screen,
                'top',
                'default'
            );
        }
    }


    public function gallery_meta_box($post){
        wp_nonce_field('post_format_gallery_nonce', 'post_format_gallery_nonce');
        $gallery = get_post_meta($post->ID, '_post_format_gallery', true);

        if(!$gallery){
            $gallery = array();
        }

        ?>
        <p>
            <?php _e('Select Images to add to your gallery here.', 'post-formats'); ?>
            <input type="button" value="Add Images" id="post_format_gallery_add" />
        </p>
        <ul id="post_format_gallery_list">
            <?php foreach($gallery as $image): ?>
                <li>
                    <img src="<?php echo(wp_get_attachment_image_src($image, 'thumbnail')[0]); ?>" /><br />
                    <input type="hidden" name="post_format_gallery[]" value="<?php echo($image); ?>" />
                    <a href="#" class="gallery_remove"><?php _e('Remove', 'post-formats'); ?></a>
                </li>
            <?php endforeach; ?>
        </ul>
        <?php
    }

    public function gallery_meta_box_save($post_id){
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'post_format_gallery_nonce' ]) && wp_verify_nonce($_POST['post_format_gallery_nonce'], 'post_format_gallery_nonce')) ? 'true' : 'false';

        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }


        if(isset($_POST['post_format_gallery'])){
            update_post_meta($post_id, '_post_format_gallery', $_POST['post_format_gallery']);
        }else {
            delete_post_meta($post_id, '_post_format_gallery');
        }
    }

}
