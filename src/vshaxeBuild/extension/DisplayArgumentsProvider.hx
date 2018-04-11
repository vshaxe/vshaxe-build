package vshaxeBuild.extension;

class DisplayArgumentsProvider {
    final projects:Array<PlacedProject>;
    final vshaxe:Vshaxe;

    public var description(default,never):String = "Project using vshaxe-build command line tools";

    public function new(projects:Array<PlacedProject>, vshaxe:Vshaxe) {
        this.projects = projects;
        this.vshaxe = vshaxe;

        vshaxe.registerDisplayArgumentsProvider("VSHaxe-Build", this);
    }

    public function activate(provideArguments:Array<String>->Void) {}

    public function deactivate() {}
}