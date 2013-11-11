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
          "dist/jquery.echoforms.min.js": ["dist/jquery.echoforms.js"],
          "dist/jquery.echoforms.extras.min.js": ["dist/jquery.echoforms.extras.js"]
        }
			},
			options: {
				report: 'min',
        banner: "<%= meta.banner %>"
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

		// CoffeeScript compilation
		coffee: {
			compile: {
        files: [
          {
					  src: ["src/preamble.coffee",
                  "src/util.coffee",
                  "src/constraints.coffee",
                  "src/controls/base.coffee",
                  "src/controls/typed.coffee",
                  "src/controls/input.coffee",
                  "src/controls/output.coffee",
                  "src/controls/select.coffee",
                  "src/controls/range.coffee",
                  "src/controls/secret.coffee",
                  "src/controls/textarea.coffee",
                  "src/controls/grouping.coffee",
                  "src/controls/group.coffee",
                  "src/controls/form.coffee",
                  "src/controls/selectref.coffee",
                  "src/plugin.coffee"],
            dest: "dist/jquery.echoforms.js"
          },
          {
            src: ["src/controls/extras/rangeslider.coffee"],
            dest: "dist/jquery.echoforms.extras.js"
          },
          {
            expand: true,
            cwd: 'spec/src/',
            ext: '.js',
            src: ['**/*.coffee'],
            dest: 'spec/dist/'
          }
        ],
        options: {
          join: true
        }
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
	//grunt.loadNpmTasks("grunt-closure-compiler");

	grunt.registerTask("default", ["coffee", "concat", "jshint", "uglify", "sass", "cssmin"]);

};
