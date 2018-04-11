package vshaxeBuild;

import haxe.Json;
import sys.io.File;
import vshaxeBuild.builders.*;
import vshaxeBuild.project.ProjectLoader;

/** The build tool for VSHaxe **/
class Main {
    static function main() new Main();

    function new() {
        var args = Sys.args();
        var cwd = args.pop();
        var cli = new CliTools();
        var parser = new CliParser(cli);
        var cliArgs = parser.parse(args);
        cli.init(cliArgs.verbose, cliArgs.dryRun);

        var projects = new ProjectLoader(cli).load(".", cwd);
        if (cliArgs.dump) File.saveContent("dump.json", Json.stringify(projects, "    "));
        if (cliArgs.listTargets) {
            var projects:ProjectList = [projects[1]];
            Sys.println(projects.getTargets().map(target -> target.name).join("\n"));
            Sys.exit(0);
        }

        new HaxeBuilder(cli, projects).build(cliArgs);
    }
}
