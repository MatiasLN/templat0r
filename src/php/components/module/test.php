<?php $class = (!empty($value->class) ? $value->class : null); ?>

<p <?php if (!empty($class)) { echo 'class="' . $class . '"'; } ?>> This is an example of a molecule to include.</p>