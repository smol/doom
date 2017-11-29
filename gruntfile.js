module.exports = function (grunt) {
	const webpackConfig = require('./webpack.config');

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

		webpack: {
			options: {
				stats: true
			},
			debug: Object.assign({
				failOnError: false,
				progress: true,
				watch: false
			}, webpackConfig)
		},

		ts: {
			wad: {
				tsconfig: './client/src/wad/tsconfig.json',
				options: {
					verbose: true
				},
				// watch: './client/src/wad'
			},
			app: {
				tsconfig: './client/src/app/tsconfig.json',
				options: {
					verbose: true
				}
			},
			engine: {
				tsconfig: './client/src/engine/tsconfig.json',
				options: {
					verbose: true
				},
				// watch: './client/src/wad'
			},
			debug: {
				tsconfig: './client/src/debug/tsconfig.json',
				options: {
					verbose: true
				},
				watch: false
				// watch: './client/src/debug'
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
				src: ['./node_modules/systemjs/dist/system-production.js', './client/node_modules/poly2tri/dist/poly2tri.min.js', './node_modules/three/build/three.min.js', './node_modules/react/dist/react.js', './node_modules/react-dom/dist/react-dom.js', './client/sylvester.js'],
				dest: './client/.build/lib.js'
			},
			wad: {
				src: ['./client/.build/srcs/wad/**/*.js'],
				dest: './client/.build/wad.js'
			}
		},

		watch: {
			wad: {
				files: ['./client/src/wad/**/*.ts'],
				tasks: ['ts:wad'],
				options: {
					atBegin: true
				}
			},
			app: {
				files: ['./client/src/app/**/*.ts'],
				tasks: ['ts:app'],
				options: {
					atBegin: true
				}
			},
			engine: {
				files: ['./client/src/engine/**/*.ts'],
				tasks: ['ts:engine'],
				options: {
					atBegin: true
				}
			},
			debug: {
				files: ['./client/src/debug/**/*.tsx', './client/src/debug/**/*.ts'],
				tasks: ['ts:debug', 'webpack:debug'],
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
				tasks: ['nodemon:server', 'watch:engine', 'watch:debug', 'watch:app', 'watch:stylesheets', 'watch:wad'],
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
	// grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-webpack');

	grunt.registerTask('dev', [
		'ts:wad',
		'ts:engine',
		'concat:lib',
		'ts:debug',
		'webpack:debug',
		'copy:assets',
		'sass',
		'concurrent:dev'
	]);

	grunt.registerTask('lib', [
		'concat:lib'
	]);

	grunt.registerTask('prod', [
		'ts:wad',
		'ts:engine',
		'concat:lib',
		'ts:debug',
		'webpack:debug',
		'copy:assets',
		'sass'
	]);


	grunt.registerTask('temp', [
		// 'ts:debug',
		'webpack:debug'
	]);
};