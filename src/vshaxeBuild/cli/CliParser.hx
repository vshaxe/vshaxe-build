package vshaxeBuild.cli;

class CliParser {
    var cli:CliTools;

    public function new(cli:CliTools) {
        this.cli = cli;
    }

    public function parse(args:Array<String>):CliArguments {
        var targets = [];
        var mode = Build;
        var debug = false;
        var dryRun = false;
        var verbose = false;
        var genTasks = false;
        var display = false;
        var dump = false;

        var help = false;

        var argHandler = hxargs.Args.generate([
            @doc("One or multiple targets to build.")
            ["-t", "--target"] => function(name:String) targets.push(name),

            @doc("Build mode - accepted values are 'build', 'install', and 'both'.")
            ["-m", "--mode"] => function(name:String) mode = name,

            @doc("Build the target(s) in debug mode. Implies -debug, -D js_unflatten and -lib jstack.")
            ["--debug"] => function() debug = true,

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

        if (args.length == 0 || help)
            cli.exit(argHandler.getDoc());

        if (genTasks && display)
            cli.fail("Can only specify one: --gen-tasks or --display");

        return {
            targets: targets,
            mode: mode,
            debug: debug,
            dryRun: dryRun,
            verbose: verbose,
            genTasks: genTasks,
            display: display,
            dump: dump
        };
    }
}

typedef CliArguments = {
    var targets(default,null):Array<String>;
    var mode(default,null):Mode;
    var debug(default,null):Bool;
    var dryRun(default,null):Bool;
    var verbose(default,null):Bool;
    var genTasks(default,null):Bool;
    var display(default,null):Bool;
    var dump(default,null):Bool;
}

@:enum abstract Mode(String) from String {
    var Build = "build";
    var Install = "install";
    var Both = "both";
}