/* global module:true */
module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            files: [
                "**/*.js"
            ],
            options: {
                ignores: [
                    "node_modules/**",
                    "public/css/**",
                    "public/js/lib/**"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.registerTask("default", ["jshint"]);
};
