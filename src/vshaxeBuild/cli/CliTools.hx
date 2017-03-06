package vshaxeBuild.cli;

@:publicFields
class CliTools {
    private var verbose:Bool;
    private var dryRun:Bool;

    function new() {}

    function init(verbose, dryRun) {
        this.verbose = verbose;
        this.dryRun = dryRun;

        if (dryRun) this.verbose = true;
    }

    function runCommands(commands:ArrayHandle<ArrayHandle<String>>) {
        for (command in commands.get())
            runCommand(command);
    }

    function runCommand(cmd:ArrayHandle<String>) {
        var command = cmd.get();
        if (command.length == 0) return;
        var executable = command[0];
        command.shift();
        run(executable, command);
    }

    function inDir(dir:String, f:Void->Void) {
        var oldCwd = Sys.getCwd();
        setCwd(dir);
        f();
        setCwd(oldCwd);
    }

    function setCwd(dir:String) {
        if (dir == null || dir.trim() == "") return;
        println("cd " + dir);
        Sys.setCwd(dir);
    }

    function run(command:String, args:Array<String>) {
        var str = command + " " + args.join(" ");
        println(str);
        if (dryRun) return;
        var result = Sys.command(command, args);
        if (result != 0) {
            Sys.println('\'$str\' exited with $result');
            Sys.exit(result);
        }
    }

    function println(message:String) {
        if (verbose) Sys.println(message);
    }

    function exit(message, code = 0) {
        Sys.println("VSHaxe Build Tool");
        Sys.println(message);
        Sys.exit(code);
    }

    function fail(message) {
        exit(message, 1);
    }

    function saveContent(path, content) {
        if (verbose) println('Saving to \'$path\':\n\n$content');
        if (!dryRun) sys.io.File.saveContent(path, content);
    }
}