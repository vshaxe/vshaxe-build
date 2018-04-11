package vshaxeBuild.extension;

import vshaxeBuild.tools.HxmlTools;

class DisplayArgumentsProvider {
    final projects:ProjectList;
    final vshaxe:Vshaxe;

    public var description(default,never):String = "Project using VSHaxe-Build command line tools";

    public function new(projects:ProjectList, vshaxe:Vshaxe) {
        this.projects = projects;
        this.vshaxe = vshaxe;

        vshaxe.registerDisplayArgumentsProvider("VSHaxe-Build", this);
    }

    public function activate(provideArguments:Array<String>->Void) {
        var hxmls = projects.resolveTargets(projects.getTargets()).map(projects.resolveTargetHxml.bind(_, true, true, true));
        var hxml = HxmlTools.mergeHxmls(hxmls, true, true);
        var arguments = getHxmlArguments(hxml);
        arguments = arguments.filterDuplicates((s1, s2) -> s1 == s2);

        trace(arguments);
        provideArguments(arguments);
    }

    public function deactivate() {}

    function getHxmlArguments(hxml:Hxml):Array<String> {
        if (hxml == null)
            return [];

        var lines = [];
        for (cp in hxml.classPaths.get()) lines.push('-cp $cp');
        for (define in hxml.defines.get()) lines.push('-D $define');
        for (lib in hxml.haxelibs.get()) lines.push('-lib ${projects.resolveHaxelib(lib).name}');
        if (hxml.debug) lines.push("-debug");
        if (hxml.output != null) lines.push('-${hxml.output.target} ${hxml.output.path}');
        if (hxml.noInline == true) lines.push('--no-inline');
        if (hxml.main != null) lines.push('-main ${hxml.main}');
        return lines;
    }
}