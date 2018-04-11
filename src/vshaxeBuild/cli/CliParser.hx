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
        var listTargets = false;

        var help = false;

        var argHandler = hxargs.Args.generate([
            @doc("One or multiple targets to build.")
            ["-t", "--target"] => function(name:String) targets.push(name),

            @doc("Build mode - accepted values are 'build', 'install', and 'both'.")
            ["-m", "--mode"] => function(name:String) mode = name,

            @doc("Build the target(s) in debug mode.")
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

            @doc("List all available targets and exit.")
            ["--list-targets"] => function() listTargets = true,

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

        if (!mode.isValid())
            cli.fail('Unknown --mode: $mode');

        return {
            targets: targets,
            mode: mode,
            debug: debug,
            dryRun: dryRun,
            verbose: verbose,
            genTasks: genTasks,
            display: display,
            listTargets: listTargets,
            dump: dump
        };
    }
}

typedef CliArguments = {
    final targets:Array<String>;
    final mode:Mode;
    final debug:Bool;
    final dryRun:Bool;
    final verbose:Bool;
    final genTasks:Bool;
    final display:Bool;
    final dump:Bool;
    final listTargets:Bool;
}

@:enum abstract Mode(String) from String {
    var Build = "build";
    var Install = "install";
    var Both = "both";

    public function isValid() {
        return this == Build || this == Install || this == Both;
    }
}