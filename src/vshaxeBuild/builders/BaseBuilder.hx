package vshaxeBuild.builders;

/** sounds like an RTS... **/
class BaseBuilder {
    static inline var Warning = "This file is generated with vshaxe-build - DO NOT EDIT MANUALLY!";

    var cli:CliTools;
    var projects:ProjectList;

    public function new(cli:CliTools, projects:ProjectList) {
        this.cli = cli;
        this.projects = projects;
    }

    public function build(cliArgs:CliArguments) {}
}