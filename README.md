<h1>Earthdata Search Components:<br>ECHO Forms</h1>

[![Build Status](https://travis-ci.org/nasa/edsc-echoforms.svg?branch=master)](https://travis-ci.org/nasa/edsc-echoforms)

A jQuery plugin implementing the
[ECHO Forms](https://earthdata.nasa.gov/files/ECHO_Forms_Specification_0.pdf)
specification. For a basic usage example and a testbed for changes,
see demo/index.html

The ECHO Forms plugin was developed as a component of
[Earthdata Search](https://github.com/nasa/earthdata-search).

## Installation and Use

### Full and Basic Plugins

We distribute two versions of the plugin, a basic, very lightweight
implementation with minimal dependencies, and a fuller version with
useful rendering extensions.

### Installing the full version

Copy the following files to a folder served by your site:

    dist/32px.png
    dist/40px.png
    dist/throbber.gif
    dist/jquery.echoforms-full.min.js
    dist/jquery.echoforms-full.min.css

And then include jQuery, the Javascript, and the CSS on a page, for instance:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script src="edsc-echoforms/jquery.echoforms-full.min.js"></script>
    <link rel="stylesheet" href="edsc-echoforms/jquery.echoforms-full.min.css">

### Installing the lightweight version

Copy the following files to a folder served by your site:

    dist/jquery.echoforms.min.js
    dist/jquery.echoforms.min.css

And then include jQuery, the Javascript, and the CSS on a page, for instance:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script src="edsc-echoforms/jquery.echoforms.min.js"></script>
    <link rel="stylesheet" href="edsc-echoforms/jquery.echoforms.min.css">

### Basic Use

Render a form inside a DOM element:

    $(el).echoforms({form: '<form xmlns="http://echo.nasa.gov/v9/echoforms">...</form>'});

Serialize a form's model, pruning as required by the specification:

    $(el).echoforms('serialize');

Serialize a form's model without pruning (useful for saving and restoring work):

    $(el).echoforms('serialize', {prune: false});

Check if a form is valid:

    $(el).echoforms('isValid');

## Developing

### Extension via "extras"

It is possible to add new form controls without modifying the existing packages.
Consider doing this for changes that are not part of the core ECHO Forms spec
or otherwise greatly impact the size of the distributed code. Existing clients
do this in order to draw map controls for some forms.

The "full" version of the plugin contains a few such controls, which can
be found under the src/controls/extras folder.

Here is a simple example:

    class MyControl extends $.echoforms.controls
      # Supply a CSS selector matching ECHO Form UI elements where
      # the custom controls should be used
      @selector: 'group[id=myid]'

      buildDom: ->
        # Build or extend the DOM with special behavior
        result = super()
        result.append('<div>Hello!</div>')
        result

      addedToDom: ->
        super()
        # TODO: Callback after being added to the DOM

      validate: ->
        super()
        # TODO: Custom validation

After building a custom control, register it with ECHO Forms to start using it.

    $.echoforms.control(MyControl)

### Building

To compile assets for exporting you'll need to do the following:
Download & install the installation package for node and npm from http://nodejs.org/ (it's one package for both npm and node.js)

Then set up your npm repo list with the latest files:

    $ cd /path/to/plugin/source/
    $ npm install

make sure ./node_modules/.bin and /usr/local/bin are in your path.

To compile:

    $ grunt

To watch for filesystem changes and rebuild automatically:

    $ grunt watch

To run the tests:

    $ grunt spec

### Debugging

The full-packaged and minified scripts are the canonical copies of the plugin,
however during development it can be useful to use scripts with sourcemaps,
which the packaged copies do not provide. To use the debugging version or
test with other versions, edit `demo/index.html`. Inside of the `<head>`
element, there are sections containing scripts for debug and packaged versions
of both the full and basic plugins. By default it runs the full packaged
version. Comment / uncomment the scripts you would like to use for testing.

### Obtaining and compiling wgxpath from source

First, obtain the source

    $ git clone https://github.com/google/closure-compiler.git
    $ git clone https://github.com/google/closure-library.git
    $ git clone https://github.com/bilts/wicked-good-xpath.git
    $ cd wicked-good-xpath/src

then compile

    $ ./compile.sh

#### Debugging wgxpath changes

To disable minifying in wgxpath to make debugging easier, make the following changes to compile.sh:

Remove following two lines:

    --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
    --compiler_flags="--use_types_for_optimization" \

change the following line:

    --output_mode compiled \

to

    --output_mode script \

## Contributing

See CONTRIBUTING.md

## License

> Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
