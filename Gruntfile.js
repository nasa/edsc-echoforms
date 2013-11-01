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
          "dist/ajaxslt-0.8.1.js": ["src/ajaxslt-0.8.1/xmltoken.js",
                                    "src/ajaxslt-0.8.1/util.js",
                                    "src/ajaxslt-0.8.1/dom.js",
                                    "src/ajaxslt-0.8.1/xpath.js"],
          "dist/ajaxslt-ext.js": ["src/ajaxslt-ext.js"],
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
				files: {
					"dist/echo-forms.js": "src/echo-forms.coffee"
				}
			}
		},

    watch: {
      scripts: {
        files: ['src/**/*', 'Gruntfile.js'],
        tasks: 'default',
        options: {
          forever: false
        }
      }
    }

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["coffee", "concat", "jshint", "uglify"]);
	grunt.registerTask("travis", ["jshint"]);

};
