package vshaxeBuild.tools;

import sys.io.File;
import json2object.utils.special.VSCodeSchemaWriter;

class SchemaGenerator {
	static function main() {
		File.saveContent("schemas/vshaxe-build.schema.json", new VSCodeSchemaWriter<Project>("\t").schema);
	}
}
