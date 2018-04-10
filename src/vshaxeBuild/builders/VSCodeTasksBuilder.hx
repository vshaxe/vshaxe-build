package vshaxeBuild.builders;

import sys.FileSystem;

class VSCodeTasksBuilder extends BaseBuilder {
    static var template = {
        version: "2.0.0",
        tasks: []
    }

    override public function build(cliArgs:CliArguments) {
        var base = Reflect.copy(template);
        for (name in cliArgs.targets) {
            var target = resolveTarget(name);
            base.tasks = buildTask(target, false).concat(buildTask(target, true));
        }
        base.tasks = base.tasks.filterDuplicates(function(t1, t2) return t1.label == t2.label);
        if (projects.length > 1 && projects[1].mainTarget != null)
            base.tasks = base.tasks.concat(createDefaultTasks(projects[1].mainTarget));

        var tasksJson = haxe.Json.stringify(base, null, "    ");
        tasksJson = '// ${BaseBuilder.Warning}\n$tasksJson\n';
        if (!FileSystem.exists(".vscode")) FileSystem.createDirectory(".vscode");
        cli.saveContent(".vscode/tasks.json", tasksJson);
    }

    function buildTask(target:Target, debug:Bool):Array<Task> {
        var suffix = "";
        if (!target.args.debug && debug) suffix = " (debug)";

        var task:Task = {
            label: '${target.name}$suffix',
            command: "haxelib",
            args: makeArgs(["-t", target.name])
        }

        if (target.args.debug || debug) {
            if (target.isBuildCommand) {
                task.group = {
                    kind: Build,
                    isDefault: true
                };
                task.label += " - BUILD";
            }
            if (target.isTestCommand) {
                task.group = {
                    kind: Test,
                    isDefault: true
                };
                task.label += " - TEST";
            }
            task.args.push("--debug");
        }

        return [task].concat(target.targetDependencies.get().flatMap(
            function(name) return buildTask(resolveTarget(name), debug)
        ));
    }

    function createDefaultTasks(target:String):Array<Task> {
        inline function makeTask(name:String, additionalArgs:Array<String>):Task
            return {
                label: '{$name}',
                command: "haxelib",
                args: makeArgs(["--target", target].concat(additionalArgs))
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
    var label:String;
    var command:String;
    var args:Array<String>;
    @:optional var group:TaskGroup;
}

typedef TaskGroup = {
    var kind:TaskKind;
    var isDefault:Bool;
}

@:enum abstract TaskKind(String) {
    var Build = "build";
    var Test = "test";
}