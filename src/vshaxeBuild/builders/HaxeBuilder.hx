package vshaxeBuild.builders;

class HaxeBuilder extends BaseBuilder {
    override public function build(cliArgs:CliArguments) {
        for (name in cliArgs.targets)
            buildTarget(projects.resolveTarget(name), cliArgs.debug, cliArgs.port, cliArgs.mode);
    }

    function installTarget(target:Target, debug:Bool) {
        cli.println('Installing dependencies for \'${target.name}\'...\n');

        cli.runCommands(target.installCommands);

        // TODO: might wanna avoid calling resolveTargetHxml() twice
        var libs = projects.resolveTargetHxml(target, debug, false, false).haxelibs.get();
        libs = libs.filterDuplicates((lib1, lib2) -> lib1 == lib2);
        for (lib in libs)
            cli.run("haxelib", projects.resolveHaxelib(lib).installArgs.get());

        cli.println('');
    }

    function buildTarget(target:Target, debug:Bool, port:Null<Int>, mode:Mode) {
        debug = debug || target.args.debug;

        if (mode != Build)
            installTarget(target, debug);

        for (dependency in target.targetDependencies.get())
            buildTarget(projects.resolveTarget(dependency), debug, port, mode);

        if (mode == Install)
            return;

        cli.println('Building \'${target.name}\'...\n');

        var workingDirectory = null;
        workingDirectory = target.args.workingDirectory;
        cli.inDir(workingDirectory, function() {
            cli.runCommands(target.beforeBuildCommands);
            if (!target.composite) {
                var args = printHxml(projects.resolveTargetHxml(target, debug, false, false));
                if (port != null) {
                    args = args.concat(["--connect", Std.string(port)]);
                }
                cli.run("haxe", args);
            }
            cli.runCommands(target.afterBuildCommands);
        });

        cli.println("\n----------------------------------------------\n");
    }

    function printHxml(hxml:Hxml):Array<String> {
        if (hxml == null)
            return [];

        var args = [];

        for (lib in hxml.haxelibs.get()) {
            args.push("-lib");
            args.push(projects.resolveHaxelib(lib).name);
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

        if (hxml.noInline == true) args.push('--no-inline');

        if (hxml.debug) args.push("-debug");

        for (_macro in hxml.macros.get()) {
            args.push("--macro");
            args.push(_macro);
        }

        if (hxml.output != null) {
            args.push('-${hxml.output.target}');
            args.push(hxml.output.path);
        }

        if (hxml.main != null) {
            args.push('-main');
            args.push(hxml.main);
        }

        if (hxml.packageName != null) args.push(hxml.packageName);

        return args;
    }
}