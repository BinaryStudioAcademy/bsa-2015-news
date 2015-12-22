module.exports = function(grunt) {
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		javascripts: ['frontend/javascripts/**/*.js'],
		server_js: ['backend/**/*.js'],
		views: ['frontend/views/**/*.jade'],
		templates: ['frontend/javascripts/**/*.jade'],
		stylesheets: ['frontend/styles/**/*.styl'],

		jshint: {
			client: ['Gruntfile.js', '<%= javascripts %>', '!frontend/javascripts/libs/**/*.js'],
			server: ['<%= server_js %>'],
			options: {
				sub: true,
				smarttabs: true,
				multistr: true,
				loopfunc: true
			}
		},
		watch: {
			options: {
				livereload: true
			},
			scripts: {
				files: ['<%= javascripts %>'],
				tasks: ['javascripts']
			},
			server_js: {
				files: ['<%= server_js %>'],
				tasks: ['jshint:server'],
				options: {
					livereload: false
				}
			},
			styles: {
				files: ['<%= stylesheets %>'],
				tasks: ['stylus']
			},
			jade_templates: {
				files: ['<%= templates %>'],
				tasks: ['jade:templates']
			},
		},

		jade: {
			templates: {
				files: [{
					expand: true,
					cwd: 'frontend/javascripts/',
					src: ['**/*.jade'],
					dest: 'public/templates/',
					ext: '.html'
				}],
			}
		},

		stylus: {
			compile: {
				options: {
					'include css': true,
					'paths': ['frontend/styles/'],
					'compress': true
				},
				files: {
					'public/styles/css/style.css': ['<%= stylesheets %>']
				}
			}
		},		

		copy: {
			libs: {
				files: [{
					expand: true,
					cwd: 'bower_components/tinymce',
					src: ['**'],
					dest: 'public/libs'
				}]
			},
			images: {
				files: [{
					expand: true,
					cwd: 'frontend/images',
					src: ['**'],
					dest: 'public/images'
				}]
			},
			js: {
				files: [{
					expand: true,
					cwd: 'frontend/javascripts/',
					src: ['**'],
					dest: 'public/javascripts/'
				}]
			}
		},

		clean: {
			templates: {
				src: ['public/templates']
			},
			public_js: {
				src: ['public/javascripts']
			},
			public_css: {
				src: ['public/css']
			}
		},

		browserify: {
			my: {
				dest: 'public/javascripts/main.js',
				src: ['frontend/javascripts/**/*.js']
			}
		},

		concat: {
			options: {
				separator: '\n'
			},
			js: {
				src: [
					'bower_components/angular/angular.js',
					'bower_components/angular-route/angular-route.js',
					'bower_components/angular-resource/angular-resource.js',
					// 'bower_components/tinymce/tinymce.min.js',
					// 'bower_components/tinymce/plugins/**/*.js',
					// 'bower_components/tinymce/themes/**/*.js',
					'bower_components/angular-ui-tinymce/src/tinymce.js',
					'bower_components/angular-aria/angular-aria.js',
					'bower_components/angular-animate/angular-animate.js',
					'bower_components/angular-material/angular-material.js',
					'bower_components/angular-socket-io/socket.js',
					'bower_components/angular-bootstrap/ui-bootstrap.js',
					'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
				],
				dest: 'public/javascripts/libs.js',
			},
			css: {
				src: [
					 'bower_components/angular-material/angular-material.css'
				],
				dest: 'public/styles/css/libs.css'
			}
		}
	};

	grunt.initConfig(config);

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('default', ['jshint', 'stylus', 'clean', 'jade', 'concat', 'copy', 'browserify']);
	grunt.registerTask('javascripts', ['jshint', 'browserify']);
	grunt.registerTask('prod', ['default', 'replace']);

};