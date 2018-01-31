<?php
/**
 * Code includes
 *
 * This array determines the code library included in your project.
 * Add or remove files to the array as needed.
 *
 * Please note that missing files will produce a fatal error.
 */

$lib_includes = [
    'lib/init.php',                     // Initial setup
    'lib/config.php',                   // Configuration
];

foreach ( $lib_includes as $file ) {
    if ( file_exists($file) ) {
        require_once $file;
    } else {
        trigger_error( sprintf( ( 'Error locating %s for inclusion' ), $file )  );
    }


}
unset( $file );


