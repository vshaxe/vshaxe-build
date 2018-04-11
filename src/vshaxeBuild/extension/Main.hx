package vshaxeBuild.extension;

import vshaxeBuild.project.ProjectLoader;
import vshaxeBuild.extension.TaskProvider;

class Main {
    function new(context:ExtensionContext) {
        var wsFolder = if (workspace.workspaceFolders == null) null else workspace.workspaceFolders[0];
        if (wsFolder == null)
            return;

        var cli = new CliTools();
        var vshaxeBuildDir = extensions.getExtension("vshaxe.vshaxe-build").extensionPath;
        var projects = new ProjectLoader(cli).load(vshaxeBuildDir, wsFolder.uri.fsPath);

        var vshaxe:Vshaxe = extensions.getExtension("nadako.vshaxe").exports;

        new DisplayArgumentsProvider(projects, vshaxe);
        new TaskProvider(projects, vshaxe);
    }

    @:keep
    @:expose("activate")
    static function main(context:ExtensionContext) {
        new Main(context);
    }
}
