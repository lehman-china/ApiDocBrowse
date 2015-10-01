var commonConst = require("./app_src/common/commonConst");
var myTaskService = require("./app_src/myTask/myTaskService");

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                //文件内容的分隔符
                separator: '\r\n\r\n'
            },
            dist: {
                files : myTaskService.getConcatPath()
            }
        },
        copy: {
            options: {
                process: function (content, srcpath) {
                    var isCtrlDir = /api_doc_data\/controller/.test( srcpath );
                    if (isCtrlDir) {
                        if ( srcpath.indexOf( commonConst.EXPLAIN_FILE ) == -1 ){
                            content = content + "// append .... test ";
                        }
                    } else {

                    }
                    return content;
                }
            },
            copySrcToBuild: {
                files: [
                    //   {src: ['path/*'], dest: 'dest/', filter: 'isFile'}, // 复制path目录下的所有文件
                    {expand: true,cwd: 'app_src/service/api_doc_data/',src: ['**'], dest: 'app_src/service/api_doc_data_build/'} // 复制path目录下的所有目录和文件
                ]
            }
        },
        clean: {
            cleanOldApiData: {
                src: ["./app_src/service/api_doc_data_build/controller"]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'views/js/api.js',
                dest: 'build/views/js/api.min.js'
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('buildDataFile', '构建数据文件', function(arg1, arg2) {
        // 删除上一次 旧数据文件
        grunt.task.run('clean:cleanOldApiData');
        // 生成制造数据
        grunt.task.run('copy:copySrcToBuild');
        // 合并 ctrl 分类 下所有文件
        grunt.task.run('concat:dist');


    });
};