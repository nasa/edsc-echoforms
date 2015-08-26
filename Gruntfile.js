module.exports = function(grunt) {

  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON("package.json"),

    meta: {
      banner: "/*\n" +
        " * <%= pkg.name %> - v<%= pkg.version %>\n" +
        " * Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.\n" +
        " * \n" +
        " * Licensed under the Apache License, Version 2.0 (the \"License\"); you may not use this file except in compliance with the License.\n" +
        " * You may obtain a copy of the License at\n" +
        " * \n" +
        " * http://www.apache.org/licenses/LICENSE-2.0\n" +
        " * \n" +
        " * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an \"AS IS\" BASIS,\n" +
        " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.\n" +
        " */ \n"
    },

    // Source compilation
    browserify: {
      build: {
        files: [
          {
            src: ["src/index.coffee"],
            dest: "build/jquery.echoforms.js"
          }
        ]
      },
      spec: {
        files: [
          {
            expand: true,
            cwd: 'spec/src/',
            ext: '.js',
            src: ['**/*.coffee'],
            dest: 'spec/build/'
          }
        ]
      },
      options: {
        debug: true,
        transform: ['coffeeify', 'uglifyify'],
        alias: ['src/extern/jquery.coffee:jquery', 'src/extern/browser.coffee:browser']
      }
    },

    clean: {
      dist: ['dist/*'],
      build: ['build/*'],
      spec: ['spec/build/**/*']
    },

    concat: {
      dist: {
        files: {
          "dist/jquery.echoforms.min.js": [
            "node_modules/wicked-good-xpath/dist/wgxpath.install.js",
            "build/jquery.echoforms.min.js"
          ],
          "dist/jquery.echoforms.min.css": [
            "build/jquery.echoforms.min.css"
          ],
          "dist/jquery.echoforms-full.min.js": [
            "node_modules/wicked-good-xpath/dist/wgxpath.install.js",
            "node_modules/simple-slider/js/simple-slider.min.js",
            "node_modules/jstree/dist/jstree.min.js",
            "build/jquery.echoforms.min.js",
            "src/extras.js"
          ],
          "dist/jquery.echoforms-full.min.css": [
            "node_modules/jstree/dist/themes/default/style.min.css",
            "build/jquery.echoforms.min.css"
          ]
        }
      },
      options: {
        banner: "<%= meta.banner %>"
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['node_modules/jstree/dist/themes/default/*.+(png|gif)'],
            dest: 'dist/',
            filter: 'isFile'
          }
        ]
      }
    },

    jasmine: {
      spec: {
        src: [
          'dist/jquery.echoforms-full.min.js'
        ],
        options: {
          styles: 'dist/jquery.echoforms-full.min.css',
          vendor: [
            'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
          ],
          specs: 'spec/build/features/**/*.js',
          helpers: 'spec/build/helpers/**/*.js',
          template: 'spec/SpecRunner.tmpl'
        }
      }
    },

    less: {
      build: {
        files: {
          'build/jquery.echoforms.min.css': 'src/echoforms.less'
        },
        options: {
          compress: true
        }
      }
    },

    uglify: {
      build: {
        files: {
          "build/jquery.echoforms.min.js": ["build/jquery.echoforms.js"]
        }
      },
      options: {
        report: 'min'
        // The following is useful to see the gzipped size occasionally, but it's expensive
        // report: 'gzip',
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*', 'spec/src/**/*', 'Gruntfile.js'],
        tasks: 'default',
        options: {
          forever: false
        }
      }
    },

    exorcise: {
      build: {
        files: {
          'build/jquery.echoforms.js.map': ['build/jquery.echoforms.js']
        },
        options: {
          base: require('path').resolve('..')
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-exorcise');

  grunt.registerTask("dist", ["clean", "copy", "browserify:build", "exorcise", "uglify", "less", "concat"]);
  grunt.registerTask("spec", ["dist", "browserify:spec", "jasmine", "clean:spec"]);

  grunt.registerTask("default", ["dist"]);
};
