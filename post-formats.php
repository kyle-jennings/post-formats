<?php
$files = array( 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat', '_ajax', '_markup');
foreach($files as $file)
    require_once 'inc/' . $file . '.php';

class PostFormats{
    public $screens = array();
    public $formats = array();

    public function __construct($formats = array(), $screens = array() ){
        $this->screens = $screens;
        $this->formats = $formats;

        add_theme_support('post-formats', $formats);

        foreach($formats as $format){

            if(class_exists('PostFormat'.ucfirst($format)) ) {
                $className = 'PostFormat'.ucfirst($format);
                $class = new $className($this->screens);

                add_action('add_meta_boxes', array($class, 'register_' . $format));
                add_action('save_post', array($class, $format . '_meta_box_save'));
            }


        }

        add_action('init', array($this, 'init'), 11);
        add_action('admin_enqueue_scripts', array($this, 'enqueue'));

        // move the metaboxes to over the content
        add_action('edit_form_after_title', function() {
            global $post, $wp_meta_boxes;

            do_meta_boxes(get_current_screen(), 'top', $post);
            unset( $wp_meta_boxes[get_post_type($post)]['top'] );
        });


    }

    public function init(){
        foreach($this->screens as $screen){
            add_post_type_support($screen, 'post-formats');
            register_taxonomy_for_object_type('post_format', $screen);
        }
    }

    public function get_base_uri(){
        $base = get_template_directory_uri();

        $parts = explode(get_template(), dirname(__FILE__));

        $url = str_replace('\\', '/', $base . array_pop($parts) );

        return $url;
    }

    public function get_base_path(){
        $base = get_template_directory();

        $parts = explode(get_template(), dirname(__FILE__));

        $url = str_replace('\\', '/', $base . array_pop($parts) );

        return $url;
    }

    public function enqueue(){
        global $typenow;

        if(in_array($typenow, $this->screens)){
            wp_enqueue_style('post_formats_css', $this->get_base_uri() . '/assets/css/post-formats.css');
            wp_enqueue_script('post_formats_js', $this->get_base_uri() . '/assets/js/post-formats.js', array('jquery'));
            wp_enqueue_script('post_media_js', $this->get_base_uri() . '/assets/js/media.js', array('jquery'));


            // examine($this->formats);
            foreach($this->formats as $format){

                $file = $this->get_base_path() . '/js/' . $format . '.js';

                // examine($this->get_base_path() . '/js/' . $format . '.js');
                if(!is_readable($file))
                    continue;

                $handle = 'post_format_'.$format.'_js';
                $uri = $this->get_base_uri() . '/js/' . $format . '.js';
                wp_enqueue_script($handle, $uri, array('jquery', 'post_formats_js'), true );
            }

        }
    }







}
