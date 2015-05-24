'use strict';

class Project {
    constructor(name) {
        this.name = name;
        console.log( "构造方法" )
    }
    destruct(){
        console.log( "2222" )
    }
    start() {
        return "Project " + this.name + " starting";
    }
}

var project = new Project("Journal");
var res = project.start(); // "Project Journal starting"

console.log( res )