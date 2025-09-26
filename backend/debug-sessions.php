<?php

require_once 'vendor/autoload.php';

$sessions = glob('storage/framework/sessions/*');
echo "Session files: " . count($sessions) . "\n";

if(count($sessions) > 0) {
    $latest = array_reduce($sessions, function($a, $b) { 
        return filemtime($a) > filemtime($b) ? $a : $b; 
    });
    echo "Latest session: " . basename($latest) . "\n";
    $content = file_get_contents($latest);
    echo "Length: " . strlen($content) . "\n";
    echo "Content: " . $content . "\n";
}