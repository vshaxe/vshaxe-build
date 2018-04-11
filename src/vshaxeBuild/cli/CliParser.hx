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
        var port = null;
        var dryRun = false;
        var verbose = false;
        var genTasks = false;
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

            @doc("Add --connect <port> when calling Haxe.")
            ["--connect"] => function(i:Int) port = i,

            @doc("Perform a dry run (no command invocations). Implies -verbose.")
            ["--dry-run"] => function() dryRun = true,

            @doc("Output the commands that are executed.")
            ["-v", "--verbose"] => function() verbose = true,

            @doc("Generate a tasks.json to .vscode (and don't build anything).")
            ["--gen-tasks"] => function() genTasks = true,

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

        if (!mode.isValid())
            cli.fail('Unknown --mode: $mode');

        return {
            targets: targets,
            mode: mode,
            debug: debug,
            port: port,
            dryRun: dryRun,
            verbose: verbose,
            genTasks: genTasks,
            listTargets: listTargets,
            dump: dump
        };
    }
}

typedef CliArguments = {
    final targets:Array<String>;
    final mode:Mode;
    final debug:Bool;
    final port:Null<Int>;
    final dryRun:Bool;
    final verbose:Bool;
    final genTasks:Bool;
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