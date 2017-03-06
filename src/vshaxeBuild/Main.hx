package vshaxeBuild;

import Std.string as stringify;
import haxe.CallStack;
import haxe.Json;
import sys.io.File;
import vshaxeBuild.builders.*;
import vshaxeBuild.project.ProjectLoader;

/** The build tool for VSHaxe **/
class Main {
    static function main() {
        try {
            new Main();
        } catch (e:Any) {
            Sys.println(e);
            Sys.println(CallStack.toString(CallStack.callStack()));
            Sys.exit(1);
        }
    }

    var cli:CliTools;

    function new() {
        var cliArgs:CliArguments = {
            targets: [],
            debug: false,
            mode: Build
        };

        var dryRun = false;
        var verbose = false;
        var genTasks = false;
        var display = false;
        var dump = false;
        var help = false;
        var modeStr = "build";

        var args = Sys.args();
        var cwd = args.pop();

        var argHandler = hxargs.Args.generate([
            @doc("One or multiple targets to build.")
            ["-t", "--target"] => function(name:String) cliArgs.targets.push(name),

            @doc("Build mode - accepted values are 'build', 'install', and 'both'.")
            ["-m", "--mode"] => function(mode:String) modeStr = mode,

            @doc("Build the target(s) in debug mode. Implies -debug, -D js_unflatten and -lib jstack.")
            ["--debug"] => function() cliArgs.debug = true,

            @doc("Perform a dry run (no command invocations). Implies -verbose.")
            ["--dry-run"] => function() dryRun = true,

            @doc("Output the commands that are executed.")
            ["-v", "--verbose"] => function() verbose = true,

            @doc("Generate a tasks.json to .vscode (and don't build anything).")
            ["--gen-tasks"] => function() genTasks = true,

            @doc("Generate a complete.hxml for auto completion (and don't build anything).")
            ["--display"] => function() display = true,

            @doc("Dump the parsed project files to dump.json.")
            ["--dump"] => function() dump = true,

            @doc("Display this help text and exit.")
            ["--help"] => function() help = true,
        ]);

        try {
            argHandler.parse(args);
        } catch (e:Any) {
            Sys.println('$e\n\nAvailable commands:\n${argHandler.getDoc()}');
            Sys.exit(1);
        }

        cli = new CliTools(verbose, dryRun);
        if (args.length == 0 || help)
            cli.exit(argHandler.getDoc());

        var projects = new ProjectLoader(cli).load(cwd);
        if (dump) File.saveContent("dump.json", Json.stringify(projects, "    "));

        validateTargets(cliArgs.targets);
        validateEnum("mode", modeStr, Mode.getConstructors());
        cliArgs.mode = Mode.createByName(getEnumName(modeStr));

        if (genTasks && display)
            cli.fail("Can only specify one: --gen-tasks or --display");

        if (genTasks) new VSCodeTasksBuilder(cli, projects).build(cliArgs);
        else if (display) new DisplayHxmlBuilder(cli, projects).build(cliArgs);
        else new HaxeBuilder(cli, projects).build(cliArgs);
    }

    function validateTargets(targets:Array<String>) {
        var targetList = 'List of valid targets:\n  ${targets}';
        if (targets.length == 0)
            cli.fail("No target(s) specified! " + targetList);

        for (target in targets)
            validateEnum("target", target, targets);
    }

    function validateEnum<T>(name:String, value:T, validValues:Array<T>) {
        var validStrValues = [for (value in validValues) stringify(value).toLowerCase()];
        if (validStrValues.indexOf(stringify(value)) == -1)
            cli.fail('Unknown $name \'$value\'. Valid values are: $validStrValues');
    }

    function getEnumName(cliName:String):String {
        return cliName.substr(0, 1).toUpperCase() + cliName.substr(1);
    }
}

typedef CliArguments = {
    var targets:Array<String>;
    var debug:Bool;
    var mode:Mode;
}

enum Mode {
    Build;
    Install;
    Both;
}