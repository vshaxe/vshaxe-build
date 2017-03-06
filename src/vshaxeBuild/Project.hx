package vshaxeBuild;

typedef Named = {
    public var name(default,null):String;
}

typedef Project = {
    /** name of a target in defaults.json to base all targets in this config on **/
    @:optional var inherit(default,null):String;
    /** name of a target to generate special task.json tasks for (install-all, generate-complete-hxml, generate-vscode-tasks) **/
    @:optional var mainTarget(default,null):String;
    var haxelibs(default,null):ArrayHandle<Haxelib>;
    var targets(default,null):ArrayHandle<Target>;
}

/** simn is gonna love this naming... **/
typedef PlacedProject = {
    >Project,
    var directory(default,null):String;
    var subProjects:ArrayHandle<PlacedProject>;
}

typedef Haxelib = {
    >Named,
    var installArgs(default,null):ArrayHandle<String>;
}

typedef Target = {
    >Named,
    >TargetArguments,
    /** Whether this target is just a collection of other targets **/
    @:optional var composite(default,null):Bool;
    /** name of a target in defaults.json to base this config on **/
    @:optional var inherit(default,null):String;
    /** arguments that only apply in debug mode **/
    @:optional var debug(default,null):TargetArguments;
    /** arguments that only apply for display **/
    @:optional var display(default,null):TargetArguments;

    /** VSCode tasks.json config **/
    @:optional var isBuildCommand(default,null):Bool;
    @:optional var isTestCommand(default,null):Bool;
}

typedef TargetArguments = {
    @:optional var targetDependencies(default,null):ArrayHandle<String>;
    /** additional, non-haxelib install commands (npm install...) **/
    @:optional var installCommands(default,null):ArrayHandle<ArrayHandle<String>>;
    @:optional var beforeBuildCommands(default,null):ArrayHandle<ArrayHandle<String>>;
    @:optional var afterBuildCommands(default,null):ArrayHandle<ArrayHandle<String>>;
    @:optional var args(default,null):Hxml;
}

typedef Hxml = {
    @:optional var workingDirectory:String; // not read-only, meh
    @:optional var classPaths(default,null):ArrayHandle<String>;
    @:optional var defines(default,null):ArrayHandle<String>;
    @:optional var haxelibs(default,null):ArrayHandle<String>;
    @:optional var macros(default,null):ArrayHandle<String>;
    @:optional var debug(default,null):Bool;
    @:optional var output(default,null):Output;
    @:optional var deadCodeElimination(default,null):DeadCodeElimination;
    @:optional var noInline(default,null):Bool;
    @:optional var main(default,null):String; // can only specify either main or package, but you could specify both here :/
    @:optional var packageName(default,null):String;
}

@:enum abstract DeadCodeElimination(String) to String {
    var Std = "std";
    var Full = "full";
    var No = "no";
}

typedef Output = {
    var target(default,null):HaxeTarget;
    var path(default,null):String;
}

@:enum abstract HaxeTarget(String) to String {
    var Swf = "swf";
    var Js = "js";
    var Neko = "neko";
    var Php = "php";
    var Cpp = "cpp";
    var Cppia = "cppia";
    var As3 = "as3";
    var Java = "java";
    var Python = "python";
    var Hl = "hl";
    var Lua = "lua";
}

@:forward(iterator)
abstract ArrayHandle<T>(Array<T>) from Array<T> {
    public function get() {
        return if (this == null) [] else this.copy();
    }
}