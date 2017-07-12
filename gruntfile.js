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

		ts: {
			wad: {
				tsconfig: './client/src/wad/tsconfig.json',
				options: {
					verbose: true
				},
				watch: './client/src/wad'
			}
		},

		copy: {
			assets: {
				expand: false,
				src: './client/assets/*',
				dest: './client/.build/',
			}
		},

		sass: {
			dist: {
				files: {
					'./client/.build/style.css': './client/stylesheets/style.scss'
				}
			}
		},

		concat: {
			lib: {
				src: ['./client/node_modules/socket.io-client/dist/socket.io.min.js'],
				dest: './client/.build/lib.js'
			},
			wad: {
				src: ['./client/.build/srcs/wad/**/*.js'],
				dest: './client/.build/wad.js'
			}
		},

		watch: {
			wad: {
				files: ['./client/.build/srcs/wad/**/*.js'],
				tasks: ['concat:wad'],
				options: {
					atBegin: true
				}
			},
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
				tasks: ['watch', 'ts'],
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
		'concat:lib',
		'copy:assets',
		'concurrent:dev'
	]);

};
