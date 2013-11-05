module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("echo-forms.json"),

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
			files: ["src/echo-forms.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

    concat: {
      dist: {
        files: {
          "dist/jquery.xpath.min.js": ["vendor/jquery-xpath/jquery.xpath.min.js"],
          "dist/jquery-compat.js": ["src/jquery-compat.js"]
        }
      },
      options: {
      }
    },

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/echo-forms.js"],
				dest: "dist/echo-forms.min.js"
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
                  "src/echo-forms.coffee"],
            dest: "dist/echo-forms.js"
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
          'dist/echo-forms.min.css': 'src/echo-forms.scss'
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
