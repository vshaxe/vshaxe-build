package vshaxeBuild.extension;

class DisplayArgumentsProvider {
    final projects:ProjectList;
    final vshaxe:Vshaxe;

    public var description(default,never):String = "Project using VSHaxe-Build command line tools";

    public function new(projects:ProjectList, vshaxe:Vshaxe) {
        this.projects = projects;
        this.vshaxe = vshaxe;

        vshaxe.registerDisplayArgumentsProvider("VSHaxe-Build", this);
    }

    public function activate(provideArguments:Array<String>->Void) {}

    public function deactivate() {}
}