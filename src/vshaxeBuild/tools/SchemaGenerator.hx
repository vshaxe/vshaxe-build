package vshaxeBuild.tools;

import sys.io.File;
import json2object.utils.JsonSchemaWriter;

using StringTools;

class SchemaGenerator {
	static function main() {
		var schema = new JsonSchemaWriter<Project>("\t").schema;
		schema = schema.replace('"description"', '"markdownDescription"');
		File.saveContent("schemas/vshaxe-build-schema.json", schema);
	}
}
