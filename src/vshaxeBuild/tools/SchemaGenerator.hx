package vshaxeBuild.tools;

import haxe.Json;
import sys.io.File;
import json2object.utils.JsonSchemaWriter;

class SchemaGenerator {
	static function main() {
		var schema = new JsonSchemaWriter<Project>().schema;
		schema = Json.stringify(Json.parse(schema), "\t");
		File.saveContent("schemas/vshaxe-build-schema.json", schema);
	}
}
