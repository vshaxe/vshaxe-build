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

    var cli = new CliTools();

    function new() {
        var args = Sys.args();
        var cwd = args.pop();
        var parser = new CliParser(cli);
        var cliArgs = parser.parse(args);

        var projects = new ProjectLoader(cli).load(cwd);
        if (cliArgs.dump) File.saveContent("dump.json", Json.stringify(projects, "    "));

        if (cliArgs.genTasks) new VSCodeTasksBuilder(cli, projects).build(cliArgs);
        else if (cliArgs.display) new DisplayHxmlBuilder(cli, projects).build(cliArgs);
        else new HaxeBuilder(cli, projects).build(cliArgs);
    }
}