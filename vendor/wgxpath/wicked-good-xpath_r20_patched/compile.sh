#!/bin/sh
python ../../closure-library/closure/bin/calcdeps.py \
    --path ../../closure-library \
    --path . \
    --input export.js \
    --output_mode script \
    --compiler_jar ../../closure-compiler/build/compiler.jar \
    --compiler_flags="--output_wrapper=(function(){%output%})()" \
    --compiler_flags="--warning_level=VERBOSE" \
    > wgxpath.install.js
