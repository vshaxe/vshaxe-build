package vshaxeBuild.builders;

import haxe.extern.EitherType;
import haxe.io.Path;
import sys.FileSystem;

class VSCodeTasksBuilder extends BaseBuilder {
    static var template = {
        version: "2.0.0",
        command: "haxelib",
        suppressTaskName: true,
        tasks: []
    }

    override public function build(cliArgs:CliArguments) {
        var base = Reflect.copy(template);
        for (name in cliArgs.targets) {
            var target = resolveTarget(name);
            base.tasks = buildTask(target, false).concat(buildTask(target, true));
        }
        base.tasks = base.tasks.filterDuplicates(function(t1, t2) return t1.taskName == t2.taskName);
        if (projects.length > 1 && projects[1].mainTarget != null)
            base.tasks = base.tasks.concat(createDefaultTasks(projects[1].mainTarget));

        var tasksJson = haxe.Json.stringify(base, null, "    ");
        tasksJson = '// ${BaseBuilder.Warning}\n$tasksJson';
        if (!FileSystem.exists(".vscode")) FileSystem.createDirectory(".vscode");
        cli.saveContent(".vscode/tasks.json", tasksJson);
    }

    function buildTask(target:Target, debug:Bool):Array<Task> {
        var suffix = "";
        if (!target.args.debug && debug) suffix = " (debug)";

        var workingDir = target.args.workingDirectory;
        var fileLocation = Absolute;
        if (!Path.isAbsolute(workingDir)) {
            workingDir = "${workspaceRoot}/" + workingDir;
            fileLocation = Relative;
        }

        var problemMatcher:EitherType<String, ProblemMatcher> = "$haxe";
        if (workingDir != "${workspaceRoot}/." || fileLocation != Relative)
            problemMatcher = createProblemMatcher(fileLocation, workingDir);

        var task:Task = {
            taskName: '${target.name}$suffix',
            args: makeArgs(["-t", target.name]),
            problemMatcher: problemMatcher
        }

        if (target.args.debug || debug) {
            if (target.isBuildCommand) {
                task.isBuildCommand = true;
                task.taskName += " - BUILD";
            }
            if (target.isTestCommand) {
                task.isTestCommand = true;
                task.taskName += " - TEST";
            }
            task.args.push("--debug");
        }

        return [task].concat(target.targetDependencies.get().flatMap(
            function(name) return buildTask(resolveTarget(name), debug)
        ));
    }

    function createProblemMatcher(fileLocation:FileLocation, directory:String):ProblemMatcher {
        return {
            owner: "haxe",
            fileLocation: [fileLocation, directory],
            pattern: "$haxe"
        };
    }

    function createDefaultTasks(target:String):Array<Task> {
        inline function makeTask(name:String, additionalArgs:Array<String>):Task
            return {
                taskName: '{$name}',
                args: makeArgs(["--target", target].concat(additionalArgs)),
                problemMatcher: "$haxe"
            };

        return [
            makeTask("install-all", ["--mode", "install"]),
            makeTask("generate-complete-hxml", ["--display"]),
            makeTask("generate-vscode-tasks", ["--gen-tasks"])
        ];
    }

    function makeArgs(additionalArgs:Array<String>):Array<String> {
        return ["run", "vshaxe-build"].concat(additionalArgs);
    }
}

typedef Task = {
    var taskName:String;
    var args:Array<String>;
    var problemMatcher:EitherType<String, ProblemMatcher>;
    @:optional var isBuildCommand:Bool;
    @:optional var isTestCommand:Bool;
}

typedef ProblemMatcher = {
    var owner:String;
    var fileLocation:Array<String>;
    var pattern:String;
}

@:enum abstract FileLocation(String) to String {
    var Absolute = "absolute";
    var Relative = "relative";
}