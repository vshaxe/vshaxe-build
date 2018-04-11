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
            tasks.push(createTask(target, false));
            if (!target.args.debug) {
                tasks.push(createTask(target, true));
            }
        }
        return tasks;
    }

    function createTask(target:Target, debug:Bool):Task {
        var suffix = "";
        if (!target.args.debug && debug) suffix = " (debug)";

        var definition:VSHaxeBuildTaskDefinition = {
            type: "vshaxe-build",
            target: target.name
        };
        if (debug) {
            definition.debug = true;
        }

        var args = ["run", "vshaxe-build", "--target", target.name];
        if (vshaxe.displayPort != null && vshaxe.enableCompilationServer) {
            args = args.concat(["--connect", Std.string(vshaxe.displayPort)]);
        }
        var execution = new ShellExecution("haxelib", args, {env: vshaxe.haxeExecutable.configuration.env});
        var task = new Task(definition, target.name + suffix, "vshaxe-build", execution, vshaxe.problemMatchers.get());
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
