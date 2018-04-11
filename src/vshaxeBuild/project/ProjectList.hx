package vshaxeBuild.project;

import haxe.ds.Option;
import vshaxeBuild.tools.HxmlTools;

@:forward(length)
abstract ProjectList(Array<PlacedProject>) from Array<PlacedProject> {
    @:op([]) inline function get(i:Int) return this[i];

    /** TODO: return Option<Haxelib> **/
    public function resolveHaxelib(name:String):Haxelib {
        function loop(projects:ArrayHandle<PlacedProject>):Haxelib {
            for (project in projects) {
                var lib = project.haxelibs.findNamed(name);
                if (lib != null) return lib;
                var libInSub = loop(project.subProjects);
                if (libInSub != null) return libInSub;
            }
            return null;
        }
        return loop(this);
    }

    /** TODO: return Option<Target> **/
    public function resolveTarget(name:String):Target {
        function loop(projects:ArrayHandle<PlacedProject>):Target {
            for (project in projects) {
                var target = project.targets.findNamed(name);
                if (target != null) return target;
                var targetInSub = loop(project.subProjects);
                if (targetInSub != null) return targetInSub;
            }
            return null;
        }
        return loop(this);
    }

    public function resolveTargets(names:Array<String>):Array<Target> {
        return names.map(resolveTarget);
    }

    public function resolveTargetHxml(target:Target, debug:Bool, flatten:Bool, display:Bool, recurse:Bool = true):Hxml {
        var hxmls:Array<Hxml> = [target.args];
        if (debug) hxmls.push(target.debug.args);
        if (display) hxmls.push(target.display.args);

        if (recurse) {
            switch (resolveParent(target)) {
                case Some(parent):
                    if (parent != null) {
                        var inheritedHxml = resolveTargetHxml(parent, debug, flatten, display, false);
                        if (inheritedHxml != null) hxmls.push(inheritedHxml);
                    }
                case None:
            }
        }

        if (flatten) {
            var dependencyHxmls = resolveTargets(target.targetDependencies.get()).map(resolveTargetHxml.bind(_, debug, flatten, display));
            hxmls = hxmls.concat(dependencyHxmls);
        }

        return HxmlTools.mergeHxmls(hxmls, flatten, debug);
    }

    public function resolveParent(target:Target):Option<Target> {
        if (target.inherit != null) {
            return Some(resolveTarget(target.inherit));
        }
        return switch (getTargetOwner(target)) {
            case Some(project): Some(resolveTarget(project.inherit));
            case None: throw 'unable to find owner of target ${target.name}';
        }
    }

    public function flattenProjects(project:PlacedProject):Array<PlacedProject> {
        var projects = [project];
        projects = projects.concat(project.subProjects.get().flatMap(flattenProjects));
        return projects;
    }

    public function getTargetOwner(target:Target):Option<Project> {
        for (project in this) {
            var flattened = flattenProjects(project);
            for (flattenedProject in flattened) {
                if (flattenedProject.targets.findNamed(target.name) != null)
                    return Some(project);
            }
        }
        return None;
    }

    public function getTargets():Array<Target> {
        var targets = [];
        for (project in this) {
            for (target in project.targets.get())
                targets.push(target);
            targets = targets.concat((project.subProjects.get() : ProjectList).getTargets());
        }
        return targets;
    }
}