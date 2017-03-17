package vshaxeBuild.tools;

import sys.io.Process;
using StringTools;

class HaxelibHelper {
    public static function getLibraryPath(library:String):String {
        var output = getProcessOutput("haxelib", ["path", library]);

        var result = null;
        var lines = output.split("\n");
        for (i in 1...lines.length) {
            if (lines[i].startsWith('-D $library')) {
                result = lines[i - 1].trim();
            }
        }
        return result;
    }

    public static function getProcessOutput(cmd:String, args:Array<String>):String {
        try {
            var process = new Process(cmd, args);
            var output = "";

            try {
                output = process.stdout.readAll().toString();
            } catch (_:Any) {}

            process.close();
            return output;
        } catch (_:Any) {
            return "";
        }
    }
}