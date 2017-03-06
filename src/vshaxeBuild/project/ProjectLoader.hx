package vshaxeBuild.project;

import haxe.io.Path;
import json2object.JsonParser;
import sys.FileSystem;
using json2object.ErrorUtils;

class ProjectLoader {
    static inline var PROJECT_FILE = "vshaxe-build.json";
    static inline var DEFAULTS_FILE = "vshaxe-build-defaults.json";

    var cli:CliTools;

    public function new(cli:CliTools) {
        this.cli = cli;
    }

    public function load(cwd:String):Array<PlacedProject> {
        var defaults = toPlacedProject(".", readProjectFile(DEFAULTS_FILE));
        cli.setCwd(cwd);
        return [defaults, findProjectFiles()];
    }

    function findProjectFiles(dir:String = "."):PlacedProject {
        var lastDir = dir.split("/").idx(-1);
        if (isDirectoryIgnored(lastDir)) return null;
        var project:PlacedProject = null;
        var subProjects = [];
        for (file in FileSystem.readDirectory(dir)) {
            var fullPath = Path.join([dir, file]);
            if (FileSystem.isDirectory(fullPath)) {
                var subProject = findProjectFiles(fullPath);
                if (subProject != null) subProjects.push(subProject);
            } else if (file == PROJECT_FILE)
                project = toPlacedProject(lastDir, readProjectFile(fullPath));
        }
        if (project != null) project.subProjects = subProjects;
        return project;
    }

    function isDirectoryIgnored(name:String):Bool {
        if (["dump", "node_modules"].indexOf(name) != -1) return true;
        if (name == "." || name == "..") return false;
        return name.startsWith(".");
    }

    function readProjectFile(path:String):Project {
        var parser = new JsonParser<Project>();
        var json = parser.fromJson(sys.io.File.getContent(path), path);
        if (parser.warnings.length > 0)
            cli.fail(parser.warnings.convertErrorArray());
        return json;
    }

    function toPlacedProject(directory:String, project:Project):PlacedProject {
        return {
            inherit: project.inherit,
            mainTarget: project.mainTarget,
            haxelibs: project.haxelibs,
            targets: project.targets,
            directory: directory,
            subProjects: []
        }
    }
}