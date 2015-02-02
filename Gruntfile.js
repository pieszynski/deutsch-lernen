
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build : {
                force : true,
                src : ['www/js/build/**']
            },
            live : {
                force : true,
                src : [
                    'www/js/build-startup.js',
                    'www/js/built-app.js',
                    'www/js/build-winstore-jscompat.min.js'
                ]
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: ['jQuery', 'Backbone', 'angular']
                }
            },
            always: {
                files: {
                    'www/js/build/source.min.js': ['www/js/build/source.js'],
                    'www/js/build-winstore-jscompat.min.js' : ['www/js/winstore-jscompat.js']
                }
            },
            live: {
                files: {
                    'www/js/build-startup.js' : ['www/js/startup.js'],
                    'www/js/build/source.min.js': ['www/js/build/source.js']
                }
            }
        },
        less: {
            dev: {
                options: {
                    compress: false
                },
                files: {
                    'css/index.css': 'css/index.less',
                    'css/startup.css': 'css/startup.less'
                }
            },
            live: {
                options: {
                    compress: true
                },
                files: {
                    'css/index.css': 'css/index.less',
                    'css/startup.css': 'css/startup.less'
                }
            }
        },
        concat : {
            dataAndIndex : {
                src : ['www/js/data.js', 'www/js/index.js'],
                dest : 'www/js/build/source.js'
            },
            vendors : {
                src : ['www/js/jqlite.1.1.1.min.js','www/js/angular.min.js','www/js/angular-touch.min.js','www/js/angular-sanitize.min.js'],
                dest : 'www/js/build/vendors.min.js'
            },
            devStartup : {
                src : ['www/js/startup.js'],
                dest : 'www/js/build-startup.js'
            },
            dev : {
                src : ['www/js/build/vendors.min.js', 'www/js/build/source.js'],
                dest : 'www/js/built-app.js'
            },
            live : {
                src : ['www/js/build/vendors.min.js', 'www/js/build/source.min.js'],
                dest : 'www/js/built-app.js'
            }
        },
        shell: {
            cordovaBrowser: {
                command: 'cordova build browser && cordova serve'
            }
        },
        copy: {
            dev: {
                files: [
                    {src: 'www/index.src.html', dest: 'www/index.html'}
                ]
            }
        },
        htmlmin: {
            live: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'www/index.html': 'www/index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('cls', ['clean']);

    grunt.registerTask('dev', [
        'clean',
        'concat:dataAndIndex',
        'concat:vendors',
        'uglify:always',
        'concat:devStartup',
        'concat:dev',
        'clean:build',
        'copy:dev',
        'shell:cordovaBrowser'
        ]);

    grunt.registerTask('live', [
        'clean',
        'concat:dataAndIndex',
        'concat:vendors',
        'uglify',
        'concat:live',
        'clean:build',
        'copy:dev',
        'htmlmin:live',
        'shell:cordovaBrowser'
        ]);

};
