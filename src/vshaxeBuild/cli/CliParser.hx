package vshaxeBuild.cli;

class CliParser {
	final cli:CliTools;

	public function new(cli:CliTools) {
		this.cli = cli;
	}

	public function parse(args:Array<String>):CliArguments {
		var targets = [];
		var debug = false;
		var port_ = null;
		var dryRun = false;
		var verbose = false;
		var dump = false;
		var listTargets = false;

		var help = false;

		// @formatter:off
		var argHandler = hxargs.Args.generate([
			@doc("One or multiple targets to build.")
			["-t", "--target"] => function(name:String) targets.push(name),
			
			@doc("Build the target(s) in debug mode.")
			["--debug"] => function() debug = true,
			
			@doc("Add --connect <port> when calling Haxe.")
			["--connect"] => function(port:Int) port_ = port,
			
			@doc("Perform a dry run (no command invocations). Implies -verbose.")
			["--dry-run"] => function() dryRun = true,
			
			@doc("Output the commands that are executed.")
			["-v", "--verbose"] => function() verbose = true,
			
			@doc("Dump the parsed project files to dump.json.")
			["--dump"] => function() dump = true,
			
			@doc("List all available targets and exit.")
			["--list-targets"] => function() listTargets = true,
			
			@doc("Any arguments after this are passed directly to Haxe.")
			["-- args..."] => function() {/* just for --help docs */},

			@doc("Display this help text and exit.")
			["--help"] => function() help = true,
		]);
		// @formatter:on
		var additional = [];
		var doubleDashIndex = args.indexOf("--");
		if (doubleDashIndex != -1) {
			for (i in doubleDashIndex + 1...args.length) {
				additional.push(args[i]);
			}
			args = args.slice(0, doubleDashIndex);
		}

		try {
			argHandler.parse(args);
		} catch (e:Any) {
			Sys.println('$e\n\nAvailable commands:\n${argHandler.getDoc()}');
			Sys.exit(1);
		}

		if (args.length == 0 || help)
			cli.exit(argHandler.getDoc());

		return {
			targets: targets,
			debug: debug,
			port: port_,
			dryRun: dryRun,
			verbose: verbose,
			listTargets: listTargets,
			dump: dump,
			additional: additional
		};
	}
}

typedef CliArguments = {
	final targets:Array<String>;
	final debug:Bool;
	final port:Null<Int>;
	final dryRun:Bool;
	final verbose:Bool;
	final dump:Bool;
	final listTargets:Bool;
	final additional:Array<String>;
}
