module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		nodemon: {
			server: {
				script: './server/main.js',
				options: {
					watch: ['./server', '!./server/node_modules/**/*'],
				}
			}
		},

		browserify: {
			dist: {
				options: {
					browserifyOptions: {
						debug: true,
						plugin: [
							[
								'tsify', {
									target: 'ES6'
								}
							]
						],
					},
					bundleExternal: false,
					// transform: [
					// 	['tsify', {
					// 		presets: ['es2015'],
					// 		plugins: ['transform-class-properties']
					// 	}]
					// ],
					watch: false, // use watchify for incremental builds!
					keepAlive: false, // watchify will exit unless task is kept alive
					exclude: ['./client/node_modules/**/*', './client/build/**/*'],
					ignore: ['./client/node_modules/**/*', './client/build/**/*']
				},
				files: {
					// if the source file has an extension of es6 then
					// we change the name of the source file accordingly.
					// The result file's extension is always .js
					"./client/build/app.js": ['./client/src/**/*.ts']
				}
			}
		},
		copy: {
			assets: {
				expand: false,
				src: './client/assets/*',
				dest: './client/build/',
			},
			stylesheets: {
				expand: false,
				src: './client/stylesheets/*',
				dest: './client/build/',
			}
		},

		concat: {
			dist: {
				src: ['./client/node_modules/socket.io-client/dist/socket.io.min.js'],
				dest: './client/build/lib.js'
			}
		},

		watch: {
			scripts: {
				files: ['./client/src/**/*.ts'],
				tasks: ['browserify'],
				options: {
					atBegin: true
				}
			},
			stylesheets: {
				files: ['client/stylesheets/*.css'],
				tasks: ['copy:stylesheets'],
				options: {
					atBegin: true
				}
			}
		},

		concurrent: {
			dev: {
				tasks: ['nodemon:server', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('dev', [
		'concat',
		'copy:assets',
		'concurrent:dev'
	]);

};
