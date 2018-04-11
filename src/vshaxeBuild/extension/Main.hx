package vshaxeBuild.extension;

class Main {
    function new(context:ExtensionContext) {

    }

    @:keep
    @:expose("activate")
    static function main(context:ExtensionContext) {
        new Main(context);
    }
}
