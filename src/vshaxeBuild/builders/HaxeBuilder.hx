package vshaxeBuild.builders;

import vshaxeBuild.cli.CliTools;
import vshaxeBuild.cli.CliParser;

class HaxeBuilder {
	final cli:CliTools;
	final projects:ProjectList;

	public function new(cli:CliTools, projects:ProjectList) {
		this.cli = cli;
		this.projects = projects;
	}

	public function build(cliArgs:CliArguments) {
		for (name in cliArgs.targets)
			buildTarget(projects.resolveTarget(name), cliArgs.debug, cliArgs.port, cliArgs.additional);
	}

	function buildTarget(target:Target, debug:Bool, port:Null<Int>, additional:Array<String>) {
		debug = debug || target.args.debug;
		var workingDirectory = target.args.workingDirectory;

		for (dependency in target.targetDependencies.get())
			buildTarget(projects.resolveTarget(dependency), debug, port, additional);

		cli.println('Building \'${target.name}\'...\n');

		cli.inDir(workingDirectory, function() {
			cli.runCommands(target.beforeBuildCommands);
			if (!target.composite) {
				var args = printHxml(projects.resolveTargetHxml(target, debug, false, false));
				if (port != null) {
					args = args.concat(["--connect", Std.string(port)]);
				}
				args = args.concat(additional);
				cli.run("npx", ["haxe"].concat(args));
			}
			cli.runCommands(target.afterBuildCommands);
		});

		cli.println("\n----------------------------------------------\n");
	}

	function printHxml(hxml:Hxml):Array<String> {
		if (hxml == null)
			return [];

		var args = [];

		for (_macro in hxml.macros.get()) {
			args.push("--macro");
			args.push(_macro);
		}

		for (lib in hxml.haxelibs.get()) {
			args.push("-lib");
			args.push(lib);
		}

		for (cp in hxml.classPaths.get()) {
			args.push("-cp");
			args.push(cp);
		}

		for (define in hxml.defines.get()) {
			args.push("-D");
			args.push(define);
		}

		if (hxml.deadCodeElimination != null) {
			args.push("-dce");
			args.push(hxml.deadCodeElimination);
		}

		if (hxml.noInline == true)
			args.push('--no-inline');
		if (hxml.times == true)
			args.push('--times');

		if (hxml.debug)
			args.push("-debug");

		if (hxml.output != null) {
			if (hxml.output.target == Interp) {
				args.push("--interp");
			} else {
				args.push('-${hxml.output.target}');
				args.push(hxml.output.path);
			}
		}

		if (hxml.main != null) {
			args.push('-main');
			args.push(hxml.main);
		}

		if (hxml.packageName != null)
			args.push(hxml.packageName);

		return args;
	}
}
