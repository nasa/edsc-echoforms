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
          "dist/wgxpath.install.js" : ["vendor/wgxpath.install.js"]
        }
      },
      options: {
      }
    },

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.echoforms.js"],
				dest: "dist/jquery.echoforms.min.js"
			},
			options: {
				report: 'min',
        banner: "<%= meta.banner %>"
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
        files: [
          {
					  src: ["src/preamble.coffee",
                  "src/util.coffee",
                  "src/constraints.coffee",
                  "src/controls.coffee",
                  "src/echoforms.coffee"],
            dest: "dist/jquery.echoforms.js"
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
    }

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-sass");

	grunt.registerTask("default", ["coffee", "concat", "jshint", "uglify", "sass"]);
	grunt.registerTask("travis", ["jshint"]);

};
