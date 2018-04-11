package vshaxeBuild.extension;

class TaskProvider {
    final projects:ProjectList;
    final vshaxe:Vshaxe;

    public function new(projects:ProjectList, vshaxe:Vshaxe) {
        this.projects = projects;
        this.vshaxe = vshaxe;
        workspace.registerTaskProvider("vshaxe-build", this);
    }

    public function provideTasks(?token:CancellationToken):ProviderResult<Array<Task>> {
        var tasks = [];
        for (target in projects.getTargets()) {
            if (target.name == "empty" || target.name == "vshaxe-node") {
                continue; // hack: skip stuff from defaults.json
            }
            tasks.push(createTaskForTarget(target, false));
            if (!target.args.debug) {
                tasks.push(createTaskForTarget(target, true));
            }
        }

        if (projects.length > 1 && projects[1].mainTarget != null) {
            tasks.push(createTask("install dependencies", projects[1].mainTarget, false, ["--mode", "install"]));
        }

        return tasks;
    }

    function createTaskForTarget(target:Target, debug:Bool):Task {
        var suffix = "";
        if (!target.args.debug && debug) suffix = " (debug)";
        return createTask(target.name + suffix, target.name, debug);
    }

    function createTask(name:String, target:String, debug:Bool, ?additionalArgs:Array<String>):Task {
        var definition:VSHaxeBuildTaskDefinition = {
            type: "vshaxe-build",
            target: name
        };
        if (debug) {
            definition.debug = true;
        }

        var args = ["run", "vshaxe-build", "--target", target];
        if (additionalArgs != null) {
            args = args.concat(additionalArgs);
        }
        if (vshaxe.displayPort != null && vshaxe.enableCompilationServer) {
            args = args.concat(["--connect", Std.string(vshaxe.displayPort)]);
        }
        var execution = new ShellExecution("haxelib", args, {env: vshaxe.haxeExecutable.configuration.env});
        var task = new Task(definition, name, "vshaxe-build", execution, vshaxe.problemMatchers.get());
        var presentation = vshaxe.taskPresentation;
        task.presentationOptions = {
            reveal: presentation.reveal,
            echo: presentation.echo,
            focus: presentation.focus,
            panel: presentation.panel
        };
        return task;
    }

    public function resolveTask(task:Task, ?token:CancellationToken):ProviderResult<Task> {
        return task;
    }
}

typedef VSHaxeBuildTaskDefinition =  {
    >TaskDefinition,
    target:String,
    ?debug:Bool
}
