package vshaxeBuild.extension;

class TaskProvider {
	final projects:ProjectList;
	final vshaxe:Vshaxe;

	public function new(projects:ProjectList, vshaxe:Vshaxe) {
		this.projects = projects;
		this.vshaxe = vshaxe;
		tasks.registerTaskProvider("vshaxe-build", this);
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
		return tasks;
	}

	function createTaskForTarget(target:Target, debug:Bool):Task {
		var args = [];
		var suffix = "";
		if (!target.args.debug && debug) {
			args.push("--debug");
			suffix = " (debug)";
		}
		return createTask(target.name + suffix, target.name, debug, args);
	}

	function createTask(name:String, target:String, debug:Bool, ?additionalArgs:Array<String>):Task {
		var definition:VSHaxeBuildTaskDefinition = {
			type: "vshaxe-build",
			target: name
		};

		var args = ["lix", "run", "vshaxe-build", "--target", target];
		if (additionalArgs != null) {
			args = args.concat(additionalArgs);
		}
		if (vshaxe.displayPort != null && vshaxe.enableCompilationServer) {
			args = args.concat(["--connect", Std.string(vshaxe.displayPort)]);
		}
		var execution = new ShellExecution("npx", args, {env: vshaxe.haxeExecutable.configuration.env});
		var task = new Task(definition, TaskScope.Workspace, name, "vshaxe-build", execution, vshaxe.problemMatchers.get());
		task.presentationOptions = cast vshaxe.taskPresentation;
		return task;
	}

	public function resolveTask(task:Task, ?token:CancellationToken):ProviderResult<Task> {
		return task;
	}
}

typedef VSHaxeBuildTaskDefinition = {
	> TaskDefinition,
	target:String,
	?debug:Bool
}
