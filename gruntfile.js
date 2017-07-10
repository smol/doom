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
						plugin: [['tsify', { target: 'ES6', typeRoots: ["node_modules/@types", "./client/.build/"], types: ["core-js", "node"] }]],
					},
					bundleExternal: false,
					debug: true,
					watch: true, // use watchify for incremental builds!
					keepAlive: true, // watchify will exit unless task is kept alive
					exclude: ['./client/node_modules/**/*'],
					ignore: ['./client/node_modules/**/*']
				},
				files: {
					// if the source file has an extension of es6 then
					// we change the name of the source file accordingly.
					// The result file's extension is always .js
					// "./client/build/app.js": ['./client/src/**/*.ts', '!./client/src/debug/**/*'],
					"./client/.build/engine.js": ['./client/src/engine/**/*.ts'],
					"./client/.build/wad.js": ['./client/src/wad/**/*.ts'],
					"./client/.build/debug.js": ['./client/src/debug/**/*.ts']
				}
			}
		},
		copy: {
			assets: {
				expand: false,
				src: './client/assets/*',
				dest: './client/build/',
			}
		},

		sass: {
			dist: {
				files: {
					'./client/build/style.css': './client/stylesheets/style.scss'
				}
			}
		},

		concat: {
			dist: {
				src: ['./client/node_modules/socket.io-client/dist/socket.io.min.js'],
				dest: './client/build/lib.js'
			}
		},

		watch: {
			// scripts: {
			// 	files: ['./client/src/**/*.ts'],
			// 	tasks: ['browserify'],
			// 	options: {
			// 		atBegin: true
			// 	}
			// },
			stylesheets: {
				files: ['client/stylesheets/**/*.scss'],
				tasks: ['sass'],
				options: {
					atBegin: true
				}
			}
		},

		concurrent: {
			dev: {
				// 'nodemon:server', 
				tasks: ['watch', 'browserify'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-ts');

	grunt.registerTask('dev', [
		'concat',
		'copy:assets',
		'concurrent:dev'
	]);

};
