package vshaxeBuild.tools;

import haxe.io.Path;

class HxmlTools {
	public static function mergeHxmls(hxmls:Array<Hxml>, flatten:Bool, debug:Bool):Hxml {
		var classPaths = [];
		var defines = [];
		var haxelibs = [];
		var macros = [];
		var debug = debug;
		var output = null;
		var deadCodeElimination = null;
		var noInline = false;
		var times = false;
		var main = null;
		var packageName = null;

		function merge(hxml:Hxml) {
			if (hxml == null)
				return;
			var rawClassPaths = hxml.classPaths.get();
			if (flatten)
				rawClassPaths = rawClassPaths.map(cp -> Path.join([hxml.workingDirectory, cp]));
			classPaths = classPaths.concat(rawClassPaths);
			defines = defines.concat(hxml.defines.get());
			haxelibs = haxelibs.concat(hxml.haxelibs.get());
			macros = macros.concat(hxml.macros.get());
			debug = debug || hxml.debug;
			if (hxml.output != null)
				if (hxml.output.target != Interp || output == null)
					output = hxml.output; // just use the most recent one I guess?
			if (hxml.deadCodeElimination != null)
				deadCodeElimination = hxml.deadCodeElimination;
			if (hxml.noInline == true)
				noInline = true;
			if (hxml.times == true)
				times = true;
			if (hxml.main != null)
				main = hxml.main;
			if (hxml.packageName != null)
				packageName = hxml.packageName;
		}

		for (hxml in hxmls)
			merge(hxml);

		return {
			workingDirectory: '',
			classPaths: classPaths,
			defines: defines,
			haxelibs: haxelibs,
			macros: macros,
			debug: debug,
			output: output,
			deadCodeElimination: deadCodeElimination,
			noInline: noInline,
			times: times,
			main: main,
			packageName: packageName
		};
	}
}
