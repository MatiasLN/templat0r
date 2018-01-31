<?php

/**
 * @param string $component_file Path to component file.
 * @param bool   $require_once   Whether to require_once or require. Default true.
 *
 */

function load_component($component_file, $require_once = true)
{

    if ($require_once) {
        require_once($component_file);
    } else {
        require($component_file);
    }
}


/**
 * @param string|array $component_names component file(s) to search for, in order.
 * @param bool $load If true the component file will be loaded if it is found.
 * @param bool $require_once Whether to require_once or require. Default true. Has no effect if $load is false.
 * @return string The component filename if one is located.
 *
 */

function locate_component($component_names, $load = false, $require_once = true)
{
    $located = '';
    foreach ((array)$component_names as $component_name) {
        if (!$component_name)
            continue;
        if (file_exists($component_name)) {
            $located = $component_name;
            break;
        } elseif (file_exists($component_name)) {
            $located = '' . $component_name;
            break;
        }
    }

    if ($load && '' != $located)
        load_component($located, $require_once);

    return $located;
}

/**
 * Load atomic components from the components folder
 *
 * @param string $type Type of component
 * @param string $component File name of the component
 * @param string|array[object|number $value Value param to pass to the component
 * @param string $componentType Alternativ component
 * @param string $path Path to the components
 *
 */

function inc($type, $component, $value = null, $componentType = '', $path = 'components')
{
    $component = $path . '/' . $type . '/' . $component;
    $components = array();
    if ('' !== $componentType) {
        $components[] = $component . "-" . $componentType . ".php";
    }

    $components[] = $component . ".php";

    $component = locate_component($components);

    if ('' !== $component) {
        include $component;
    } else {
        echo 'CANNOT FIND COMPONENT(S): "' . implode("\" or \"", $component) . '"';
    }
}