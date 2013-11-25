module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("echoforms.json"),

		meta: {
			banner: "/*\n" +
				" *  <%= pkg.name %> - v<%= pkg.version %>\n" +
        // FIXME: If we release this publicly, we need author and license info
				// " *  Made by <%= pkg.author.name %>\n" +
				// " *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Lint definitions
		jshint: {
			files: ["src/echoforms.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

    concat: {
      dist: {
        files: {
          "dist/wgxpath.install.patched.js" : ["vendor/wgxpath/wgxpath.install.patched.js"],
          "dist/jquery.simple-slider.min.js" : ["vendor/jquery-simple-slider/js/simple-slider.min.js"]
        }
      },
      options: {
      }
    },

		// Minify definitions
		uglify: {
			dist: {
        files: {
          "dist/jquery.echoforms.min.js": ["dist/jquery.echoforms.js"]
        }
			},
			options: {
				report: 'min',
        banner: "<%= meta.banner %>"
        // The following is useful to see the gzipped size occasionally, but it's expensive
        // report: 'gzip',
        // Generate source maps
        // sourceMap: function(dest) {return dest + '.map';}
			}
		},

    /*
    'closure-compiler': {
      dist: {
        js: ["dist/jquery.echoforms.js"],
        closurePath: 'vendor/closure',
        jsOutputFile: "dist/jquery.echoforms.min.js",
        noreport: true,
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          warning_level:"DEFAULT"
        }
      }
    },
    */

		// Source compilation
		browserify: {
			compile: {
        files: [
          {
            src: ["src/**/*.js", "src/**/*.coffee"],
            dest: "dist/jquery.echoforms.js"
          }
        ],
        options: {
          transform: ['coffeeify'],
          alias: ['src/extern/jquery.coffee:jquery', 'src/extern/browser.coffee:browser']
        }
      }
		},

    // Spec compilation
    coffee: {
      compile: {
        files: [
          {
            expand: true,
            cwd: 'spec/src/',
            ext: '.js',
            src: ['**/*.coffee'],
            dest: 'spec/dist/'
          }
        ]
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

    sass: {
      dist: {
        files: {
          'dist/jquery.echoforms.min.css': 'src/echoforms.scss'
        },
        options: {
          style: 'compressed'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/jquery.echoforms.min.css': ['dist/jquery.echoforms.min.css']
        }
      },
			options: {
        banner: "<%= meta.banner %>"
			}
    }

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-browserify');
	//grunt.loadNpmTasks("grunt-closure-compiler");

	grunt.registerTask("default", ["browserify", "coffee", "concat", "jshint", "uglify", "sass", "cssmin"]);

};
