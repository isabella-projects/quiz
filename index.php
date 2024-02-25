<?php

/*
  Plugin Name: Quiz
  Description: Give your readers a multiple choice question.
  Version: 1.0
  Author: D. Minkov | isabella-projects
  Author URI: https://github.com/isabella-projects/quiz
*/

if (!defined('ABSPATH')) exit;

class Quiz
{
    function __construct()
    {
        add_action('init', array($this, 'adminAssets'));
    }

    function adminAssets()
    {

        wp_register_style(
            'quiz_edit_css',
            plugin_dir_url(__FILE__) . 'build/index.css',
        );

        wp_register_script(
            'quiz_block_type',
            plugin_dir_url(__FILE__) . 'build/index.js',
            [
                'wp-blocks',
                'wp-element',
                'wp-editor'
            ]
        );

        register_block_type('multiple-choice/quiz', [
            'editor_script' => 'quiz_block_type',
            'editor_style' => 'quiz_edit_css',
            'render_callback' => [$this, 'renderQuiz']
        ]);
    }

    public function renderQuiz($attributes)
    {
        ob_start();
        include_once 'templates/render.template.php';
        $output = ob_get_clean();
        return $output;
    }
}

$quiz = new Quiz();
