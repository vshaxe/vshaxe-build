(function ($hx_exports, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.now = function() {
	return Date.now();
};
var json2object_reader_BaseParser = function(errors,putils,errorType) {
	this.errors = errors;
	this.putils = putils;
	this.errorType = errorType;
};
json2object_reader_BaseParser.__name__ = true;
json2object_reader_BaseParser.prototype = {
	fromJson: function(jsonString,filename) {
		if(filename == null) {
			filename = "";
		}
		this.putils = new json2object_PositionUtils(jsonString);
		this.errors = [];
		try {
			var json = new hxjsonast_Parser(jsonString,filename).doParse();
			this.loadJson(json);
		} catch( _g ) {
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(((_g1) instanceof hxjsonast_Error)) {
				var e = _g1;
				this.errors.push(json2object_Error.ParserError(e.message,this.putils.convertPosition(e.pos)));
			} else {
				throw _g;
			}
		}
		return this.value;
	}
	,loadJson: function(json,variable) {
		if(variable == null) {
			variable = "";
		}
		var pos = this.putils.convertPosition(json.pos);
		var _g = json.value;
		switch(_g._hx_index) {
		case 0:
			var s = _g.s;
			this.loadJsonString(s,pos,variable);
			break;
		case 1:
			var n = _g.s;
			this.loadJsonNumber(n,pos,variable);
			break;
		case 2:
			var o = _g.fields;
			this.loadJsonObject(o,pos,variable);
			break;
		case 3:
			var a = _g.values;
			this.loadJsonArray(a,pos,variable);
			break;
		case 4:
			var b = _g.b;
			this.loadJsonBool(b,pos,variable);
			break;
		case 5:
			this.loadJsonNull(pos,variable);
			break;
		}
		return this.value;
	}
	,loadJsonNull: function(pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonString: function(s,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadString: function(s,pos,variable,validValues,defaultValue) {
		if(validValues.indexOf(s) != -1) {
			return s;
		}
		this.onIncorrectType(pos,variable);
		return defaultValue;
	}
	,loadJsonNumber: function(f,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonUInt: function(f,pos,variable,value) {
		var uint = 0;
		f = StringTools.trim(f);
		var neg = f.charAt(0) == "-";
		if(neg) {
			f = HxOverrides.substr(f,1,null);
		}
		var hex = StringTools.startsWith(f,"0x");
		if(hex) {
			f = HxOverrides.substr(f,2,null);
		}
		var base = hex ? 16 : 10;
		var pow = 1;
		var i = f.length - 1;
		while(i >= 0) {
			var cur = hex ? Std.parseInt("0x" + f.charAt(i)) : Std.parseInt(f.charAt(i));
			if(cur == null) {
				this.onIncorrectType(pos,variable);
				return value;
			}
			uint = uint + pow * cur;
			pow *= base;
			--i;
		}
		return uint;
	}
	,loadJsonInt: function(f,pos,variable,value) {
		if(Std.parseInt(f) != null && Std.parseInt(f) == parseFloat(f)) {
			return Std.parseInt(f);
		}
		this.onIncorrectType(pos,variable);
		return value;
	}
	,loadJsonFloat: function(f,pos,variable,value) {
		if(Std.parseInt(f) != null) {
			return parseFloat(f);
		}
		this.onIncorrectType(pos,variable);
		return value;
	}
	,loadJsonBool: function(b,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonArray: function(a,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonArrayValue: function(a,loadJsonFn,variable) {
		var _g = [];
		var _g1 = 0;
		while(_g1 < a.length) {
			var j = a[_g1];
			++_g1;
			var tmp;
			try {
				tmp = loadJsonFn(j,variable);
			} catch( _g2 ) {
				var _g3 = haxe_Exception.caught(_g2).unwrap();
				if(js_Boot.__instanceof(_g3,json2object_InternalError)) {
					var e = _g3;
					if(e != json2object_InternalError.ParsingThrow) {
						throw haxe_Exception.thrown(e);
					}
					continue;
				} else {
					throw _g2;
				}
			}
			_g.push(tmp);
		}
		return _g;
	}
	,loadJsonObject: function(o,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadObjectField: function(loadJsonFn,field,name,assigned,defaultValue,pos) {
		try {
			var ret = loadJsonFn(field.value,field.name);
			this.mapSet(assigned,name,true);
			return ret;
		} catch( _g ) {
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(js_Boot.__instanceof(_g1,json2object_InternalError)) {
				var e = _g1;
				if(e != json2object_InternalError.ParsingThrow) {
					throw haxe_Exception.thrown(e);
				}
			} else {
				var e = _g1;
				this.errors.push(json2object_Error.CustomFunctionException(e,pos));
			}
		}
		return defaultValue;
	}
	,loadObjectFieldReflect: function(loadJsonFn,field,name,assigned,pos) {
		try {
			this.value[name] = loadJsonFn(field.value,field.name);
			this.mapSet(assigned,name,true);
		} catch( _g ) {
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(js_Boot.__instanceof(_g1,json2object_InternalError)) {
				var e = _g1;
				if(e != json2object_InternalError.ParsingThrow) {
					throw haxe_Exception.thrown(e);
				}
			} else {
				var e = _g1;
				this.errors.push(json2object_Error.CustomFunctionException(e,pos));
			}
		}
	}
	,objectSetupAssign: function(assigned,keys,values) {
		var _g = 0;
		var _g1 = keys.length;
		while(_g < _g1) {
			var i = _g++;
			this.mapSet(assigned,keys[i],values[i]);
		}
	}
	,objectErrors: function(assigned,pos) {
		var lastPos = this.putils.convertPosition(new hxjsonast_Position(pos.file,pos.max - 1,pos.max - 1));
		var h = assigned.h;
		var s_h = h;
		var s_keys = Object.keys(h);
		var s_length = s_keys.length;
		var s_current = 0;
		while(s_current < s_length) {
			var s = s_keys[s_current++];
			if(!assigned.h[s]) {
				this.errors.push(json2object_Error.UninitializedVariable(s,lastPos));
			}
		}
	}
	,onIncorrectType: function(pos,variable) {
		this.parsingThrow();
	}
	,parsingThrow: function() {
		if(this.errorType != 0) {
			throw haxe_Exception.thrown(json2object_InternalError.ParsingThrow);
		}
	}
	,objectThrow: function(pos,variable) {
		if(this.errorType == 2) {
			throw haxe_Exception.thrown(json2object_InternalError.ParsingThrow);
		}
		if(this.errorType == 1) {
			this.errors.push(json2object_Error.UninitializedVariable(variable,pos));
		}
	}
	,mapSet: function(map,key,value) {
		map.h[key] = value;
	}
	,__class__: json2object_reader_BaseParser
};
var JsonParser_$1 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$1.__name__ = true;
JsonParser_$1.__super__ = json2object_reader_BaseParser;
JsonParser_$1.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ targets : vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.Target>, ?mainTarget : Null<String>, ?inherit : Null<String> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["inherit","mainTarget","targets"],[true,true,false]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "inherit":
				this.loadObjectFieldReflect(($_=new JsonParser_$3(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"inherit",assigned,pos);
				break;
			case "mainTarget":
				this.loadObjectFieldReflect(($_=new JsonParser_$3(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"mainTarget",assigned,pos);
				break;
			case "targets":
				this.loadObjectFieldReflect(($_=new JsonParser_$4(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"targets",assigned,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { inherit : new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), mainTarget : new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), targets : new JsonParser_$4([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$1
});
var JsonParser_$10 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$10.__name__ = true;
JsonParser_$10.__super__ = json2object_reader_BaseParser;
JsonParser_$10.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"String",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonString: function(s,pos,variable) {
		this.value = s;
	}
	,getAuto: function() {
		return new JsonParser_$10([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$10
});
var JsonParser_$12 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$12.__name__ = true;
JsonParser_$12.__super__ = json2object_reader_BaseParser;
JsonParser_$12.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"vshaxeBuild.project.ArrayHandle<String>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonArray: function(a,pos,variable) {
		this.value = this.loadJsonArrayValue(a,($_=new JsonParser_$10(this.errors,this.putils,2),$bind($_,$_.loadJson)),variable);
	}
	,getAuto: function() {
		return new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$12
});
var JsonParser_$15 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$15.__name__ = true;
JsonParser_$15.__super__ = json2object_reader_BaseParser;
JsonParser_$15.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ ?workingDirectory : Null<String>, ?times : Null<Bool>, ?packageName : Null<String>, ?output : Null<vshaxeBuild.project.Output>, ?noInline : Null<Bool>, ?main : Null<String>, ?macros : Null<vshaxeBuild.project.ArrayHandle<String>>, ?haxelibs : Null<vshaxeBuild.project.ArrayHandle<String>>, ?defines : Null<vshaxeBuild.project.ArrayHandle<String>>, ?debug : Null<Bool>, ?deadCodeElimination : Null<vshaxeBuild.project.DeadCodeElimination>, ?classPaths : Null<vshaxeBuild.project.ArrayHandle<String>> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["classPaths","deadCodeElimination","debug","defines","haxelibs","macros","main","noInline","output","packageName","times","workingDirectory"],[true,true,true,true,true,true,true,true,true,true,true,true]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "classPaths":
				this.loadObjectFieldReflect(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"classPaths",assigned,pos);
				break;
			case "deadCodeElimination":
				this.loadObjectFieldReflect(($_=new JsonParser_$24(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"deadCodeElimination",assigned,pos);
				break;
			case "debug":
				this.loadObjectFieldReflect(($_=new JsonParser_$9(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"debug",assigned,pos);
				break;
			case "defines":
				this.loadObjectFieldReflect(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"defines",assigned,pos);
				break;
			case "haxelibs":
				this.loadObjectFieldReflect(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"haxelibs",assigned,pos);
				break;
			case "macros":
				this.loadObjectFieldReflect(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"macros",assigned,pos);
				break;
			case "main":
				this.loadObjectFieldReflect(($_=new JsonParser_$3(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"main",assigned,pos);
				break;
			case "noInline":
				this.loadObjectFieldReflect(($_=new JsonParser_$9(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"noInline",assigned,pos);
				break;
			case "output":
				this.loadObjectFieldReflect(($_=new JsonParser_$27(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"output",assigned,pos);
				break;
			case "packageName":
				this.loadObjectFieldReflect(($_=new JsonParser_$3(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"packageName",assigned,pos);
				break;
			case "times":
				this.loadObjectFieldReflect(($_=new JsonParser_$9(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"times",assigned,pos);
				break;
			case "workingDirectory":
				this.value.workingDirectory = this.loadObjectField(($_=new JsonParser_$3(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"workingDirectory",assigned,this.value.workingDirectory,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { classPaths : new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), deadCodeElimination : new JsonParser_$24([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), debug : new JsonParser_$9([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), defines : new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), haxelibs : new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), macros : new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), main : new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), noInline : new JsonParser_$9([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), output : new JsonParser_$27([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), packageName : new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), times : new JsonParser_$9([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), workingDirectory : new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$15
});
var JsonParser_$18 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$18.__name__ = true;
JsonParser_$18.__super__ = json2object_reader_BaseParser;
JsonParser_$18.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ ?targetDependencies : Null<vshaxeBuild.project.ArrayHandle<String>>, ?releaseAfterBuildCommands : Null<vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.ArrayHandle<String>>>, ?beforeBuildCommands : Null<vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.ArrayHandle<String>>>, ?args : Null<vshaxeBuild.project.Hxml>, ?afterBuildCommands : Null<vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.ArrayHandle<String>>> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["afterBuildCommands","args","beforeBuildCommands","releaseAfterBuildCommands","targetDependencies"],[true,true,true,true,true]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "afterBuildCommands":
				this.loadObjectFieldReflect(($_=new JsonParser_$7(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"afterBuildCommands",assigned,pos);
				break;
			case "args":
				this.loadObjectFieldReflect(($_=new JsonParser_$15(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"args",assigned,pos);
				break;
			case "beforeBuildCommands":
				this.loadObjectFieldReflect(($_=new JsonParser_$7(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"beforeBuildCommands",assigned,pos);
				break;
			case "releaseAfterBuildCommands":
				this.loadObjectFieldReflect(($_=new JsonParser_$7(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"releaseAfterBuildCommands",assigned,pos);
				break;
			case "targetDependencies":
				this.loadObjectFieldReflect(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"targetDependencies",assigned,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		var tmp = new JsonParser_$7([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp1 = new JsonParser_$7([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp2 = new JsonParser_$7([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp3 = new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		return { afterBuildCommands : tmp, args : { }, beforeBuildCommands : tmp1, releaseAfterBuildCommands : tmp2, targetDependencies : tmp3};
	}
	,__class__: JsonParser_$18
});
var JsonParser_$24 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$24.__name__ = true;
JsonParser_$24.__super__ = json2object_reader_BaseParser;
JsonParser_$24.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.value = "std";
		this.errors.push(json2object_Error.IncorrectType(variable,"vshaxeBuild.project.DeadCodeElimination",pos));
		this.objectThrow(pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonString: function(s,pos,variable) {
		this.value = this.loadString(s,pos,variable,["std","full","no"],"std");
	}
	,getAuto: function() {
		return new JsonParser_$24([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$24
});
var JsonParser_$27 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$27.__name__ = true;
JsonParser_$27.__super__ = json2object_reader_BaseParser;
JsonParser_$27.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ target : vshaxeBuild.project.HaxeTarget, ?path : Null<String> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["path","target"],[true,false]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "path":
				this.loadObjectFieldReflect(($_=new JsonParser_$3(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"path",assigned,pos);
				break;
			case "target":
				this.loadObjectFieldReflect(($_=new JsonParser_$30(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"target",assigned,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { path : new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), target : new JsonParser_$30([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$27
});
var JsonParser_$3 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$3.__name__ = true;
JsonParser_$3.__super__ = json2object_reader_BaseParser;
JsonParser_$3.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"String",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonString: function(s,pos,variable) {
		this.value = s;
	}
	,getAuto: function() {
		return new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$3
});
var JsonParser_$30 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$30.__name__ = true;
JsonParser_$30.__super__ = json2object_reader_BaseParser;
JsonParser_$30.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.value = "swf";
		this.errors.push(json2object_Error.IncorrectType(variable,"vshaxeBuild.project.HaxeTarget",pos));
		this.objectThrow(pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonString: function(s,pos,variable) {
		this.value = this.loadString(s,pos,variable,["swf","js","neko","php","cpp","cppia","as3","java","python","hl","lua","interp"],"swf");
	}
	,getAuto: function() {
		return new JsonParser_$30([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$30
});
var JsonParser_$31 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$31.__name__ = true;
JsonParser_$31.__super__ = json2object_reader_BaseParser;
JsonParser_$31.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Array<String>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonArray: function(a,pos,variable) {
		this.value = this.loadJsonArrayValue(a,($_=new JsonParser_$10(this.errors,this.putils,2),$bind($_,$_.loadJson)),variable);
	}
	,getAuto: function() {
		return new JsonParser_$31([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$31
});
var JsonParser_$4 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$4.__name__ = true;
JsonParser_$4.__super__ = json2object_reader_BaseParser;
JsonParser_$4.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.Target>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonArray: function(a,pos,variable) {
		this.value = this.loadJsonArrayValue(a,($_=new JsonParser_$5(this.errors,this.putils,2),$bind($_,$_.loadJson)),variable);
	}
	,getAuto: function() {
		return new JsonParser_$4([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$4
});
var JsonParser_$5 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$5.__name__ = true;
JsonParser_$5.__super__ = json2object_reader_BaseParser;
JsonParser_$5.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ ?targetDependencies : Null<vshaxeBuild.project.ArrayHandle<String>>, ?releaseAfterBuildCommands : Null<vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.ArrayHandle<String>>>, name : String, ?inherit : Null<String>, ?display : Null<vshaxeBuild.project.TargetArguments>, ?debug : Null<vshaxeBuild.project.TargetArguments>, ?composite : Null<Bool>, ?beforeBuildCommands : Null<vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.ArrayHandle<String>>>, ?args : Null<vshaxeBuild.project.Hxml>, ?afterBuildCommands : Null<vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.ArrayHandle<String>>> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["afterBuildCommands","args","beforeBuildCommands","composite","debug","display","inherit","name","releaseAfterBuildCommands","targetDependencies"],[true,true,true,true,true,true,true,false,true,true]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "afterBuildCommands":
				this.loadObjectFieldReflect(($_=new JsonParser_$7(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"afterBuildCommands",assigned,pos);
				break;
			case "args":
				this.loadObjectFieldReflect(($_=new JsonParser_$15(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"args",assigned,pos);
				break;
			case "beforeBuildCommands":
				this.loadObjectFieldReflect(($_=new JsonParser_$7(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"beforeBuildCommands",assigned,pos);
				break;
			case "composite":
				this.loadObjectFieldReflect(($_=new JsonParser_$9(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"composite",assigned,pos);
				break;
			case "debug":
				this.loadObjectFieldReflect(($_=new JsonParser_$18(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"debug",assigned,pos);
				break;
			case "display":
				this.loadObjectFieldReflect(($_=new JsonParser_$18(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"display",assigned,pos);
				break;
			case "inherit":
				this.loadObjectFieldReflect(($_=new JsonParser_$3(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"inherit",assigned,pos);
				break;
			case "name":
				this.loadObjectFieldReflect(($_=new JsonParser_$10(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"name",assigned,pos);
				break;
			case "releaseAfterBuildCommands":
				this.loadObjectFieldReflect(($_=new JsonParser_$7(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"releaseAfterBuildCommands",assigned,pos);
				break;
			case "targetDependencies":
				this.loadObjectFieldReflect(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"targetDependencies",assigned,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		var tmp = new JsonParser_$7([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp1 = new JsonParser_$7([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp2 = new JsonParser_$9([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp3 = new JsonParser_$3([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp4 = new JsonParser_$10([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp5 = new JsonParser_$7([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		var tmp6 = new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
		return { afterBuildCommands : tmp, args : { }, beforeBuildCommands : tmp1, composite : tmp2, debug : { }, display : { }, inherit : tmp3, name : tmp4, releaseAfterBuildCommands : tmp5, targetDependencies : tmp6};
	}
	,__class__: JsonParser_$5
});
var JsonParser_$7 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$7.__name__ = true;
JsonParser_$7.__super__ = json2object_reader_BaseParser;
JsonParser_$7.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"vshaxeBuild.project.ArrayHandle<vshaxeBuild.project.ArrayHandle<String>>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonArray: function(a,pos,variable) {
		this.value = this.loadJsonArrayValue(a,($_=new JsonParser_$31(this.errors,this.putils,2),$bind($_,$_.loadJson)),variable);
	}
	,getAuto: function() {
		return new JsonParser_$7([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$7
});
var JsonParser_$9 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
JsonParser_$9.__name__ = true;
JsonParser_$9.__super__ = json2object_reader_BaseParser;
JsonParser_$9.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Bool",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonBool: function(b,pos,variable) {
		this.value = b;
	}
	,getAuto: function() {
		return new JsonParser_$9([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$9
});
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.startsWith = function(s,start) {
	if(s.length >= start.length) {
		return s.lastIndexOf(start,0) == 0;
	} else {
		return false;
	}
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var haxe_io_Output = function() { };
haxe_io_Output.__name__ = true;
var _$Sys_FileOutput = function(fd) {
	this.fd = fd;
};
_$Sys_FileOutput.__name__ = true;
_$Sys_FileOutput.__super__ = haxe_io_Output;
_$Sys_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	writeByte: function(c) {
		js_node_Fs.writeSync(this.fd,String.fromCodePoint(c));
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		return js_node_Fs.writeSync(this.fd,js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length),pos,len);
	}
	,writeString: function(s,encoding) {
		js_node_Fs.writeSync(this.fd,s);
	}
	,flush: function() {
		js_node_Fs.fsyncSync(this.fd);
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,__class__: _$Sys_FileOutput
});
var haxe_io_Input = function() { };
haxe_io_Input.__name__ = true;
var _$Sys_FileInput = function(fd) {
	this.fd = fd;
};
_$Sys_FileInput.__name__ = true;
_$Sys_FileInput.__super__ = haxe_io_Input;
_$Sys_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	readByte: function() {
		var buf = js_node_buffer_Buffer.alloc(1);
		try {
			js_node_Fs.readSync(this.fd,buf,0,1,null);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		try {
			return js_node_Fs.readSync(this.fd,buf,pos,len,null);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,__class__: _$Sys_FileInput
});
var Vscode = require("vscode");
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
haxe_IMap.__isInterface__ = true;
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
	,__class__: haxe_ValueException
});
var haxe_ds_Option = $hxEnums["haxe.ds.Option"] = { __ename__:true,__constructs__:null
	,Some: ($_=function(v) { return {_hx_index:0,v:v,__enum__:"haxe.ds.Option",toString:$estr}; },$_._hx_name="Some",$_.__params__ = ["v"],$_)
	,None: {_hx_name:"None",_hx_index:1,__enum__:"haxe.ds.Option",toString:$estr}
};
haxe_ds_Option.__constructs__ = [haxe_ds_Option.Some,haxe_ds_Option.None];
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.prototype = {
	__class__: haxe_io_Bytes
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_io_Eof = function() {
};
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:true,__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
var haxe_io_Path = function() { };
haxe_io_Path.__name__ = true;
haxe_io_Path.join = function(paths) {
	var _g = [];
	var _g1 = 0;
	var _g2 = paths;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v != null && v != "") {
			_g.push(v);
		}
	}
	var paths = _g;
	if(paths.length == 0) {
		return "";
	}
	var path = paths[0];
	var _g = 1;
	var _g1 = paths.length;
	while(_g < _g1) {
		var i = _g++;
		path = haxe_io_Path.addTrailingSlash(path);
		path += paths[i];
	}
	return haxe_io_Path.normalize(path);
};
haxe_io_Path.normalize = function(path) {
	var slash = "/";
	path = path.split("\\").join(slash);
	if(path == slash) {
		return slash;
	}
	var target = [];
	var _g = 0;
	var _g1 = path.split(slash);
	while(_g < _g1.length) {
		var token = _g1[_g];
		++_g;
		if(token == ".." && target.length > 0 && target[target.length - 1] != "..") {
			target.pop();
		} else if(token == "") {
			if(target.length > 0 || HxOverrides.cca(path,0) == 47) {
				target.push(token);
			}
		} else if(token != ".") {
			target.push(token);
		}
	}
	var tmp = target.join(slash);
	var acc_b = "";
	var colon = false;
	var slashes = false;
	var _g2_offset = 0;
	var _g2_s = tmp;
	while(_g2_offset < _g2_s.length) {
		var s = _g2_s;
		var index = _g2_offset++;
		var c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		var c1 = c;
		if(c1 >= 65536) {
			++_g2_offset;
		}
		var c2 = c1;
		switch(c2) {
		case 47:
			if(!colon) {
				slashes = true;
			} else {
				var i = c2;
				colon = false;
				if(slashes) {
					acc_b += "/";
					slashes = false;
				}
				acc_b += String.fromCodePoint(i);
			}
			break;
		case 58:
			acc_b += ":";
			colon = true;
			break;
		default:
			var i1 = c2;
			colon = false;
			if(slashes) {
				acc_b += "/";
				slashes = false;
			}
			acc_b += String.fromCodePoint(i1);
		}
	}
	return acc_b;
};
haxe_io_Path.addTrailingSlash = function(path) {
	if(path.length == 0) {
		return "/";
	}
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		if(c2 != path.length - 1) {
			return path + "\\";
		} else {
			return path;
		}
	} else if(c1 != path.length - 1) {
		return path + "/";
	} else {
		return path;
	}
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var hxjsonast_Error = function(message,pos) {
	this.message = message;
	this.pos = pos;
};
hxjsonast_Error.__name__ = true;
hxjsonast_Error.prototype = {
	__class__: hxjsonast_Error
};
var hxjsonast_Json = function(value,pos) {
	this.value = value;
	this.pos = pos;
};
hxjsonast_Json.__name__ = true;
hxjsonast_Json.prototype = {
	__class__: hxjsonast_Json
};
var hxjsonast_JsonValue = $hxEnums["hxjsonast.JsonValue"] = { __ename__:true,__constructs__:null
	,JString: ($_=function(s) { return {_hx_index:0,s:s,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JString",$_.__params__ = ["s"],$_)
	,JNumber: ($_=function(s) { return {_hx_index:1,s:s,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JNumber",$_.__params__ = ["s"],$_)
	,JObject: ($_=function(fields) { return {_hx_index:2,fields:fields,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JObject",$_.__params__ = ["fields"],$_)
	,JArray: ($_=function(values) { return {_hx_index:3,values:values,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JArray",$_.__params__ = ["values"],$_)
	,JBool: ($_=function(b) { return {_hx_index:4,b:b,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JBool",$_.__params__ = ["b"],$_)
	,JNull: {_hx_name:"JNull",_hx_index:5,__enum__:"hxjsonast.JsonValue",toString:$estr}
};
hxjsonast_JsonValue.__constructs__ = [hxjsonast_JsonValue.JString,hxjsonast_JsonValue.JNumber,hxjsonast_JsonValue.JObject,hxjsonast_JsonValue.JArray,hxjsonast_JsonValue.JBool,hxjsonast_JsonValue.JNull];
var hxjsonast_JObjectField = function(name,namePos,value) {
	this.name = name;
	this.namePos = namePos;
	this.value = value;
};
hxjsonast_JObjectField.__name__ = true;
hxjsonast_JObjectField.prototype = {
	__class__: hxjsonast_JObjectField
};
var hxjsonast_Parser = function(source,filename) {
	this.source = source;
	this.filename = filename;
	this.pos = 0;
};
hxjsonast_Parser.__name__ = true;
hxjsonast_Parser.parse = function(source,filename) {
	return new hxjsonast_Parser(source,filename).doParse();
};
hxjsonast_Parser.prototype = {
	doParse: function() {
		var result = this.parseRec();
		var c;
		while(true) {
			c = this.source.charCodeAt(this.pos++);
			var c1 = c;
			if(!(c1 == c1)) {
				break;
			}
			switch(c) {
			case 9:case 10:case 13:case 32:
				break;
			default:
				this.invalidChar();
			}
		}
		return result;
	}
	,parseRec: function() {
		while(true) {
			var c = this.source.charCodeAt(this.pos++);
			switch(c) {
			case 9:case 10:case 13:case 32:
				break;
			case 34:
				var save = this.pos;
				var s = this.parseString();
				return new hxjsonast_Json(hxjsonast_JsonValue.JString(s),new hxjsonast_Position(this.filename,save - 1,this.pos));
			case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				var start = this.pos - 1;
				var minus = c == 45;
				var digit = !minus;
				var zero = c == 48;
				var point = false;
				var e = false;
				var pm = false;
				var end = false;
				while(true) {
					switch(this.source.charCodeAt(this.pos++)) {
					case 43:case 45:
						if(!e || pm) {
							this.invalidNumber(start);
						}
						digit = false;
						pm = true;
						break;
					case 46:
						if(minus || point || e) {
							this.invalidNumber(start);
						}
						digit = false;
						point = true;
						break;
					case 48:
						if(zero && !point) {
							this.invalidNumber(start);
						}
						if(minus) {
							minus = false;
							zero = true;
						}
						digit = true;
						break;
					case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						if(zero && !point) {
							this.invalidNumber(start);
						}
						if(minus) {
							minus = false;
						}
						digit = true;
						zero = false;
						break;
					case 69:case 101:
						if(minus || zero || e) {
							this.invalidNumber(start);
						}
						digit = false;
						e = true;
						break;
					default:
						if(!digit) {
							this.invalidNumber(start);
						}
						this.pos--;
						end = true;
					}
					if(end) {
						break;
					}
				}
				var s1 = HxOverrides.substr(this.source,start,this.pos - start);
				return new hxjsonast_Json(hxjsonast_JsonValue.JNumber(s1),new hxjsonast_Position(this.filename,start,this.pos));
			case 91:
				var values = [];
				var comma = null;
				var startPos = this.pos - 1;
				while(true) switch(this.source.charCodeAt(this.pos++)) {
				case 9:case 10:case 13:case 32:
					break;
				case 44:
					if(comma) {
						comma = false;
					} else {
						this.invalidChar();
					}
					break;
				case 93:
					if(comma == false) {
						this.invalidChar();
					}
					return new hxjsonast_Json(hxjsonast_JsonValue.JArray(values),new hxjsonast_Position(this.filename,startPos,this.pos));
				default:
					if(comma) {
						this.invalidChar();
					}
					this.pos--;
					values.push(this.parseRec());
					comma = true;
				}
				break;
			case 102:
				var save1 = this.pos;
				if(this.source.charCodeAt(this.pos++) != 97 || this.source.charCodeAt(this.pos++) != 108 || this.source.charCodeAt(this.pos++) != 115 || this.source.charCodeAt(this.pos++) != 101) {
					this.pos = save1;
					this.invalidChar();
				}
				return new hxjsonast_Json(hxjsonast_JsonValue.JBool(false),new hxjsonast_Position(this.filename,save1 - 1,this.pos));
			case 110:
				var save2 = this.pos;
				if(this.source.charCodeAt(this.pos++) != 117 || this.source.charCodeAt(this.pos++) != 108 || this.source.charCodeAt(this.pos++) != 108) {
					this.pos = save2;
					this.invalidChar();
				}
				return new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position(this.filename,save2 - 1,this.pos));
			case 116:
				var save3 = this.pos;
				if(this.source.charCodeAt(this.pos++) != 114 || this.source.charCodeAt(this.pos++) != 117 || this.source.charCodeAt(this.pos++) != 101) {
					this.pos = save3;
					this.invalidChar();
				}
				return new hxjsonast_Json(hxjsonast_JsonValue.JBool(true),new hxjsonast_Position(this.filename,save3 - 1,this.pos));
			case 123:
				var fields = [];
				var names_h = Object.create(null);
				var field = null;
				var fieldPos = null;
				var comma1 = null;
				var startPos1 = this.pos - 1;
				while(true) switch(this.source.charCodeAt(this.pos++)) {
				case 9:case 10:case 13:case 32:
					break;
				case 34:
					if(field != null || comma1) {
						this.invalidChar();
					}
					var fieldStartPos = this.pos - 1;
					field = this.parseString();
					fieldPos = new hxjsonast_Position(this.filename,fieldStartPos,this.pos);
					if(Object.prototype.hasOwnProperty.call(names_h,field)) {
						throw haxe_Exception.thrown(new hxjsonast_Error("Duplicate field name \"" + field + "\"",fieldPos));
					} else {
						names_h[field] = true;
					}
					break;
				case 44:
					if(comma1) {
						comma1 = false;
					} else {
						this.invalidChar();
					}
					break;
				case 58:
					if(field == null) {
						this.invalidChar();
					}
					fields.push(new hxjsonast_JObjectField(field,fieldPos,this.parseRec()));
					field = null;
					fieldPos = null;
					comma1 = true;
					break;
				case 125:
					if(field != null || comma1 == false) {
						this.invalidChar();
					}
					return new hxjsonast_Json(hxjsonast_JsonValue.JObject(fields),new hxjsonast_Position(this.filename,startPos1,this.pos));
				default:
					this.invalidChar();
				}
				break;
			default:
				this.invalidChar();
			}
		}
	}
	,parseString: function() {
		var start = this.pos;
		var buf = null;
		while(true) {
			var c = this.source.charCodeAt(this.pos++);
			if(c == 34) {
				break;
			}
			if(c == 92) {
				if(buf == null) {
					buf = new StringBuf();
				}
				var s = this.source;
				var len = this.pos - start - 1;
				buf.b += len == null ? HxOverrides.substr(s,start,null) : HxOverrides.substr(s,start,len);
				c = this.source.charCodeAt(this.pos++);
				switch(c) {
				case 34:case 47:case 92:
					buf.b += String.fromCodePoint(c);
					break;
				case 98:
					buf.b += String.fromCodePoint(8);
					break;
				case 102:
					buf.b += String.fromCodePoint(12);
					break;
				case 110:
					buf.b += String.fromCodePoint(10);
					break;
				case 114:
					buf.b += String.fromCodePoint(13);
					break;
				case 116:
					buf.b += String.fromCodePoint(9);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.source,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCodePoint(uc);
					break;
				default:
					throw haxe_Exception.thrown(new hxjsonast_Error("Invalid escape sequence \\" + String.fromCodePoint(c),new hxjsonast_Position(this.filename,this.pos - 2,this.pos)));
				}
				start = this.pos;
			} else if(c != c) {
				this.pos--;
				throw haxe_Exception.thrown(new hxjsonast_Error("Unclosed string",new hxjsonast_Position(this.filename,start - 1,this.pos)));
			}
		}
		if(buf == null) {
			return HxOverrides.substr(this.source,start,this.pos - start - 1);
		} else {
			var s = this.source;
			var len = this.pos - start - 1;
			buf.b += len == null ? HxOverrides.substr(s,start,null) : HxOverrides.substr(s,start,len);
			return buf.b;
		}
	}
	,parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45;
		var digit = !minus;
		var zero = c == 48;
		var point = false;
		var e = false;
		var pm = false;
		var end = false;
		while(true) {
			switch(this.source.charCodeAt(this.pos++)) {
			case 43:case 45:
				if(!e || pm) {
					this.invalidNumber(start);
				}
				digit = false;
				pm = true;
				break;
			case 46:
				if(minus || point || e) {
					this.invalidNumber(start);
				}
				digit = false;
				point = true;
				break;
			case 48:
				if(zero && !point) {
					this.invalidNumber(start);
				}
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) {
					this.invalidNumber(start);
				}
				if(minus) {
					minus = false;
				}
				digit = true;
				zero = false;
				break;
			case 69:case 101:
				if(minus || zero || e) {
					this.invalidNumber(start);
				}
				digit = false;
				e = true;
				break;
			default:
				if(!digit) {
					this.invalidNumber(start);
				}
				this.pos--;
				end = true;
			}
			if(end) {
				break;
			}
		}
		var s = HxOverrides.substr(this.source,start,this.pos - start);
		return new hxjsonast_Json(hxjsonast_JsonValue.JNumber(s),new hxjsonast_Position(this.filename,start,this.pos));
	}
	,nextChar: function() {
		return this.source.charCodeAt(this.pos++);
	}
	,mk: function(pos,value) {
		return new hxjsonast_Json(value,pos);
	}
	,mkPos: function(min,max) {
		return new hxjsonast_Position(this.filename,min,max);
	}
	,invalidChar: function() {
		this.pos--;
		throw haxe_Exception.thrown(new hxjsonast_Error("Invalid character: " + this.source.charAt(this.pos),new hxjsonast_Position(this.filename,this.pos,this.pos + 1)));
	}
	,invalidNumber: function(start) {
		throw haxe_Exception.thrown(new hxjsonast_Error("Invalid number: " + this.source.substring(start,this.pos),new hxjsonast_Position(this.filename,start,this.pos)));
	}
	,__class__: hxjsonast_Parser
};
var hxjsonast_Position = function(file,min,max) {
	this.file = file;
	this.min = min;
	this.max = max;
};
hxjsonast_Position.__name__ = true;
hxjsonast_Position.prototype = {
	__class__: hxjsonast_Position
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_node_ChildProcess = require("child_process");
var js_node_Fs = require("fs");
var js_node_KeyValue = {};
js_node_KeyValue.get_key = function(this1) {
	return this1[0];
};
js_node_KeyValue.get_value = function(this1) {
	return this1[1];
};
var js_node_buffer_Buffer = require("buffer").Buffer;
var js_node_stream_WritableNewOptionsAdapter = {};
js_node_stream_WritableNewOptionsAdapter.from = function(options) {
	if(!Object.prototype.hasOwnProperty.call(options,"final")) {
		Object.defineProperty(options,"final",{ get : function() {
			return options.final_;
		}});
	}
	return options;
};
var js_node_url_URLSearchParamsEntry = {};
js_node_url_URLSearchParamsEntry._new = function(name,value) {
	var this1 = [name,value];
	return this1;
};
js_node_url_URLSearchParamsEntry.get_name = function(this1) {
	return this1[0];
};
js_node_url_URLSearchParamsEntry.get_value = function(this1) {
	return this1[1];
};
var json2object_Error = $hxEnums["json2object.Error"] = { __ename__:true,__constructs__:null
	,IncorrectType: ($_=function(variable,expected,pos) { return {_hx_index:0,variable:variable,expected:expected,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="IncorrectType",$_.__params__ = ["variable","expected","pos"],$_)
	,IncorrectEnumValue: ($_=function(value,expected,pos) { return {_hx_index:1,value:value,expected:expected,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="IncorrectEnumValue",$_.__params__ = ["value","expected","pos"],$_)
	,InvalidEnumConstructor: ($_=function(value,expected,pos) { return {_hx_index:2,value:value,expected:expected,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="InvalidEnumConstructor",$_.__params__ = ["value","expected","pos"],$_)
	,UninitializedVariable: ($_=function(variable,pos) { return {_hx_index:3,variable:variable,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="UninitializedVariable",$_.__params__ = ["variable","pos"],$_)
	,UnknownVariable: ($_=function(variable,pos) { return {_hx_index:4,variable:variable,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="UnknownVariable",$_.__params__ = ["variable","pos"],$_)
	,ParserError: ($_=function(message,pos) { return {_hx_index:5,message:message,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="ParserError",$_.__params__ = ["message","pos"],$_)
	,CustomFunctionException: ($_=function(e,pos) { return {_hx_index:6,e:e,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="CustomFunctionException",$_.__params__ = ["e","pos"],$_)
};
json2object_Error.__constructs__ = [json2object_Error.IncorrectType,json2object_Error.IncorrectEnumValue,json2object_Error.InvalidEnumConstructor,json2object_Error.UninitializedVariable,json2object_Error.UnknownVariable,json2object_Error.ParserError,json2object_Error.CustomFunctionException];
var json2object_InternalError = $hxEnums["json2object.InternalError"] = { __ename__:true,__constructs__:null
	,AbstractNoJsonRepresentation: ($_=function(name) { return {_hx_index:0,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="AbstractNoJsonRepresentation",$_.__params__ = ["name"],$_)
	,CannotGenerateSchema: ($_=function(name) { return {_hx_index:1,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="CannotGenerateSchema",$_.__params__ = ["name"],$_)
	,HandleExpr: {_hx_name:"HandleExpr",_hx_index:2,__enum__:"json2object.InternalError",toString:$estr}
	,ParsingThrow: {_hx_name:"ParsingThrow",_hx_index:3,__enum__:"json2object.InternalError",toString:$estr}
	,UnsupportedAbstractEnumType: ($_=function(name) { return {_hx_index:4,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedAbstractEnumType",$_.__params__ = ["name"],$_)
	,UnsupportedEnumAbstractValue: ($_=function(name) { return {_hx_index:5,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedEnumAbstractValue",$_.__params__ = ["name"],$_)
	,UnsupportedMapKeyType: ($_=function(name) { return {_hx_index:6,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedMapKeyType",$_.__params__ = ["name"],$_)
	,UnsupportedSchemaObjectType: ($_=function(name) { return {_hx_index:7,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedSchemaObjectType",$_.__params__ = ["name"],$_)
	,UnsupportedSchemaType: ($_=function(type) { return {_hx_index:8,type:type,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedSchemaType",$_.__params__ = ["type"],$_)
};
json2object_InternalError.__constructs__ = [json2object_InternalError.AbstractNoJsonRepresentation,json2object_InternalError.CannotGenerateSchema,json2object_InternalError.HandleExpr,json2object_InternalError.ParsingThrow,json2object_InternalError.UnsupportedAbstractEnumType,json2object_InternalError.UnsupportedEnumAbstractValue,json2object_InternalError.UnsupportedMapKeyType,json2object_InternalError.UnsupportedSchemaObjectType,json2object_InternalError.UnsupportedSchemaType];
var json2object_CustomFunctionError = function(message) {
	this.message = message;
};
json2object_CustomFunctionError.__name__ = true;
json2object_CustomFunctionError.prototype = {
	__class__: json2object_CustomFunctionError
};
var json2object_ErrorUtils = function() { };
json2object_ErrorUtils.__name__ = true;
json2object_ErrorUtils.convertError = function(e) {
	var pos;
	switch(e._hx_index) {
	case 0:
		var _g = e.variable;
		var _g = e.expected;
		var pos1 = e.pos;
		pos = pos1;
		break;
	case 1:
		var _g = e.value;
		var _g = e.expected;
		var pos1 = e.pos;
		pos = pos1;
		break;
	case 2:
		var _g = e.value;
		var _g = e.expected;
		var pos1 = e.pos;
		pos = pos1;
		break;
	case 3:
		var _g = e.variable;
		var pos1 = e.pos;
		pos = pos1;
		break;
	case 4:
		var _g = e.variable;
		var pos1 = e.pos;
		pos = pos1;
		break;
	case 5:
		var _g = e.message;
		var pos1 = e.pos;
		pos = pos1;
		break;
	case 6:
		var _g = e.e;
		var pos1 = e.pos;
		pos = pos1;
		break;
	}
	var header = "";
	if(pos != null) {
		var file = pos.file == "" ? "line" : "" + pos.file + ":";
		if(pos.lines.length == 1) {
			header = "" + file + pos.lines[0].number + ": characters " + pos.lines[0].start + "-" + pos.lines[0].end + " : ";
		} else if(pos.lines.length > 1) {
			header = "" + file + pos.lines[0].number + ": lines " + pos.lines[0].number + "-" + pos.lines[pos.lines.length - 1].number + " : ";
		}
	}
	switch(e._hx_index) {
	case 0:
		var _g = e.pos;
		var variable = e.variable;
		var expected = e.expected;
		return header + ("Variable '" + variable + "' should be of type '" + expected + "'");
	case 1:
		var _g = e.pos;
		var variable = e.value;
		var expected = e.expected;
		return header + ("Identifier '" + variable + "' isn't part of '" + expected + "'");
	case 2:
		var _g = e.pos;
		var variable = e.value;
		var expected = e.expected;
		return header + ("Enum argument '" + variable + "' should be of type '" + expected + "'");
	case 3:
		var _g = e.pos;
		var variable = e.variable;
		return header + ("Variable '" + variable + "' should be in the json");
	case 4:
		var _g = e.pos;
		var variable = e.variable;
		return header + ("Variable '" + variable + "' isn't part of the schema");
	case 5:
		var _g = e.pos;
		var message = e.message;
		return header + ("Parser error: " + message);
	case 6:
		var _g = e.pos;
		var e1 = e.e;
		return header + ("Custom function exception: " + (e1 == null ? "null" : Std.string(e1)));
	}
};
json2object_ErrorUtils.convertErrorArray = function(e) {
	var f = json2object_ErrorUtils.convertError;
	var result = new Array(e.length);
	var _g = 0;
	var _g1 = e.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = f(e[i]);
	}
	return result.join("\n");
};
var json2object_JsonParser = function() { };
json2object_JsonParser.__name__ = true;
var json2object_PositionUtils = function(content) {
	this.linesInfo = [];
	var s = 0;
	var e = 0;
	var i = 0;
	var lineCount = 0;
	while(i < content.length) switch(content.charAt(i)) {
	case "\n":
		e = i;
		this.linesInfo.push({ number : lineCount, start : s, end : e});
		++lineCount;
		++i;
		s = i;
		break;
	case "\r":
		e = i;
		if(content.charAt(i + 1) == "\n") {
			++e;
		}
		this.linesInfo.push({ number : lineCount, start : s, end : e});
		++lineCount;
		i = e + 1;
		s = i;
		break;
	default:
		++i;
	}
	this.linesInfo.push({ number : lineCount, start : s, end : i});
};
json2object_PositionUtils.__name__ = true;
json2object_PositionUtils.prototype = {
	convertPosition: function(position) {
		var file = position.file;
		var min = position.min;
		var max = position.max;
		var pos = { file : file, min : min + 1, max : max + 1, lines : []};
		var lastLine = this.linesInfo.length - 1;
		var bounds_min = 0;
		var bounds_max = lastLine;
		if(min > this.linesInfo[0].end) {
			while(bounds_max > bounds_min) {
				var i = (bounds_min + bounds_max) / 2 | 0;
				var line = this.linesInfo[i];
				if(line.start == min) {
					bounds_min = i;
					bounds_max = i;
				}
				if(line.end < min) {
					bounds_min = i + 1;
				}
				if(line.start > min || line.end >= min && line.start < min) {
					bounds_max = i;
				}
			}
		}
		var _g = bounds_min;
		var _g1 = this.linesInfo.length;
		while(_g < _g1) {
			var i = _g++;
			var line = this.linesInfo[i];
			if(line.start <= min && line.end >= max) {
				pos.lines.push({ number : line.number + 1, start : min - line.start + 1, end : max - line.start + 1});
				break;
			}
			if(line.start <= min && min <= line.end) {
				pos.lines.push({ number : line.number + 1, start : min - line.start + 1, end : line.end + 1});
			}
			if(line.start <= max && max <= line.end) {
				pos.lines.push({ number : line.number + 1, start : line.start + 1, end : max - line.start + 1});
			}
			if(line.start >= max || line.end >= max) {
				break;
			}
		}
		return pos;
	}
	,revert: function(position) {
		return new hxjsonast_Position(position.file,position.min - 1,position.max - 1);
	}
	,__class__: json2object_PositionUtils
};
var sys_FileSystem = function() { };
sys_FileSystem.__name__ = true;
sys_FileSystem.isDirectory = function(path) {
	try {
		return js_node_Fs.statSync(path).isDirectory();
	} catch( _g ) {
		return false;
	}
};
var sys_io_FileInput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileInput.__name__ = true;
sys_io_FileInput.__super__ = haxe_io_Input;
sys_io_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	readByte: function() {
		var buf = js_node_buffer_Buffer.alloc(1);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,0,1,this.pos);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos++;
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,pos,len,this.pos);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos += bytesRead;
		return bytesRead;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,eof: function() {
		return this.pos >= js_node_Fs.fstatSync(this.fd).size;
	}
	,__class__: sys_io_FileInput
});
var sys_io_FileOutput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileOutput.__name__ = true;
sys_io_FileOutput.__super__ = haxe_io_Output;
sys_io_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	writeByte: function(b) {
		var buf = js_node_buffer_Buffer.alloc(1);
		buf[0] = b;
		js_node_Fs.writeSync(this.fd,buf,0,1,this.pos);
		this.pos++;
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var wrote = js_node_Fs.writeSync(this.fd,buf,pos,len,this.pos);
		this.pos += wrote;
		return wrote;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,__class__: sys_io_FileOutput
});
var sys_io_FileSeek = $hxEnums["sys.io.FileSeek"] = { __ename__:true,__constructs__:null
	,SeekBegin: {_hx_name:"SeekBegin",_hx_index:0,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekCur: {_hx_name:"SeekCur",_hx_index:1,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekEnd: {_hx_name:"SeekEnd",_hx_index:2,__enum__:"sys.io.FileSeek",toString:$estr}
};
sys_io_FileSeek.__constructs__ = [sys_io_FileSeek.SeekBegin,sys_io_FileSeek.SeekCur,sys_io_FileSeek.SeekEnd];
var vscode_ShellExecution = require("vscode").ShellExecution;
var vscode_Task = require("vscode").Task;
var vscode_TaskScope = require("vscode").TaskScope;
var vshaxe_HaxeExecutableSource = $hxEnums["vshaxe.HaxeExecutableSource"] = { __ename__:true,__constructs__:null
	,Settings: {_hx_name:"Settings",_hx_index:0,__enum__:"vshaxe.HaxeExecutableSource",toString:$estr}
	,Provider: ($_=function(name) { return {_hx_index:1,name:name,__enum__:"vshaxe.HaxeExecutableSource",toString:$estr}; },$_._hx_name="Provider",$_.__params__ = ["name"],$_)
};
vshaxe_HaxeExecutableSource.__constructs__ = [vshaxe_HaxeExecutableSource.Settings,vshaxe_HaxeExecutableSource.Provider];
var vshaxe_ReadOnlyArray = {};
vshaxe_ReadOnlyArray.arrayAccess = function(this1,i) {
	return this1[i];
};
vshaxe_ReadOnlyArray.get = function(this1) {
	return this1.slice();
};
var vshaxeBuild_cli_CliTools = function() {
	this.dryRun = false;
	this.verbose = false;
};
vshaxeBuild_cli_CliTools.__name__ = true;
vshaxeBuild_cli_CliTools.prototype = {
	init: function(verbose,dryRun) {
		this.verbose = verbose;
		this.dryRun = dryRun;
		if(dryRun) {
			this.verbose = true;
		}
	}
	,runCommands: function(commands) {
		var _g = 0;
		var _g1 = vshaxeBuild_project_ArrayHandle.get(commands);
		while(_g < _g1.length) {
			var command = _g1[_g];
			++_g;
			this.runCommand(command);
		}
	}
	,runCommand: function(cmd) {
		var command = vshaxeBuild_project_ArrayHandle.get(cmd);
		if(command.length == 0) {
			return;
		}
		var executable = command[0];
		command.shift();
		this.run(executable,command);
	}
	,inDir: function(dir,f) {
		var oldCwd = process.cwd();
		this.setCwd(dir);
		f();
		this.setCwd(oldCwd);
	}
	,setCwd: function(dir) {
		if(dir == null || StringTools.trim(dir) == "") {
			return;
		}
		this.println("cd " + dir);
		process.chdir(dir);
	}
	,run: function(command,args) {
		var str = command + " " + args.join(" ");
		this.println(str);
		if(this.dryRun) {
			return;
		}
		var result = args == null ? js_node_ChildProcess.spawnSync(command,{ shell : true, stdio : "inherit"}).status : js_node_ChildProcess.spawnSync(command,args,{ stdio : "inherit"}).status;
		if(result != 0) {
			process.stdout.write(Std.string("'" + str + "' exited with " + result));
			process.stdout.write("\n");
			process.exit(result);
		}
	}
	,println: function(message) {
		if(this.verbose) {
			process.stdout.write(Std.string(message));
			process.stdout.write("\n");
		}
	}
	,exit: function(message,code) {
		if(code == null) {
			code = 0;
		}
		process.stdout.write("VSHaxe Build Tool");
		process.stdout.write("\n");
		process.stdout.write(Std.string(message));
		process.stdout.write("\n");
		process.exit(code);
	}
	,fail: function(message) {
		this.exit(message,1);
	}
	,saveContent: function(path,content) {
		if(this.verbose) {
			this.println("Saving to '" + path + "':\n\n" + content);
		}
		if(!this.dryRun) {
			js_node_Fs.writeFileSync(path,content);
		}
	}
	,__class__: vshaxeBuild_cli_CliTools
};
var vshaxeBuild_extension_DisplayArgumentsProvider = function(projects,vshaxe) {
	this.description = "Project using VSHaxe-Build command line tools";
	this.projects = projects;
	this.vshaxe = vshaxe;
	vshaxe.registerDisplayArgumentsProvider("VSHaxe-Build",this);
};
vshaxeBuild_extension_DisplayArgumentsProvider.__name__ = true;
vshaxeBuild_extension_DisplayArgumentsProvider.prototype = {
	activate: function(provideArguments) {
		var _this = vshaxeBuild_project_ProjectList.getTargets(this.projects);
		var _e = this.projects;
		var _g = function(target,debug,flatten,display,recurse) {
			return vshaxeBuild_project_ProjectList.resolveTargetHxml(_e,target,debug,flatten,display,recurse);
		};
		var debug = true;
		var flatten = true;
		var display = true;
		var f = function(target) {
			return _g(target,debug,flatten,display);
		};
		var result = new Array(_this.length);
		var _g1 = 0;
		var _g2 = _this.length;
		while(_g1 < _g2) {
			var i = _g1++;
			result[i] = f(_this[i]);
		}
		var hxmls = result;
		var hxml = vshaxeBuild_tools_HxmlTools.mergeHxmls(hxmls,true,true);
		var $arguments = this.vshaxe.parseHxmlToArguments(this.getHxmlArguments(hxml).join("\n"));
		provideArguments($arguments);
	}
	,deactivate: function() {
	}
	,getHxmlArguments: function(hxml) {
		if(hxml == null) {
			return [];
		}
		var lines = [];
		var _g = 0;
		var _g1 = vshaxeBuild_tools_ArrayTools.filterDuplicates(vshaxeBuild_project_ArrayHandle.get(hxml.classPaths),function(e1,e2) {
			return e1 == e2;
		});
		while(_g < _g1.length) {
			var cp = _g1[_g];
			++_g;
			lines.push("-cp " + cp);
		}
		var _g = 0;
		var _g1 = vshaxeBuild_tools_ArrayTools.filterDuplicates(vshaxeBuild_project_ArrayHandle.get(hxml.defines),function(e1,e2) {
			return e1 == e2;
		});
		while(_g < _g1.length) {
			var define = _g1[_g];
			++_g;
			lines.push("-D " + define);
		}
		var _g = 0;
		var _g1 = vshaxeBuild_tools_ArrayTools.filterDuplicates(vshaxeBuild_project_ArrayHandle.get(hxml.haxelibs),function(e1,e2) {
			return e1 == e2;
		});
		while(_g < _g1.length) {
			var lib = _g1[_g];
			++_g;
			lines.push("-lib " + lib);
		}
		var _g = 0;
		var _g1 = vshaxeBuild_tools_ArrayTools.filterDuplicates(vshaxeBuild_project_ArrayHandle.get(hxml.macros),function(e1,e2) {
			return e1 == e2;
		});
		while(_g < _g1.length) {
			var macroArg = _g1[_g];
			++_g;
			lines.push("--macro " + macroArg);
		}
		if(hxml.debug) {
			lines.push("-debug");
		}
		if(hxml.output != null) {
			lines.push(hxml.output.target == "interp" ? "--interp" : "-" + hxml.output.target + " " + hxml.output.path);
		}
		if(hxml.noInline == true) {
			lines.push("--no-inline");
		}
		if(hxml.times == true) {
			lines.push("--times");
		}
		if(hxml.main != null) {
			lines.push("-main " + hxml.main);
		}
		return lines;
	}
	,__class__: vshaxeBuild_extension_DisplayArgumentsProvider
};
var vshaxeBuild_extension_Main = function(context) {
	var wsFolder = Vscode.workspace.workspaceFolders == null ? null : Vscode.workspace.workspaceFolders[0];
	if(wsFolder == null) {
		return;
	}
	var cli = new vshaxeBuild_cli_CliTools();
	var vshaxeBuildDir = Vscode.extensions.getExtension("vshaxe.vshaxe-build").extensionPath;
	var projects = new vshaxeBuild_project_ProjectLoader(cli).load(vshaxeBuildDir,wsFolder.uri.fsPath);
	var vshaxe = Vscode.extensions.getExtension("nadako.vshaxe").exports;
	new vshaxeBuild_extension_DisplayArgumentsProvider(projects,vshaxe);
	new vshaxeBuild_extension_TaskProvider(projects,vshaxe);
};
vshaxeBuild_extension_Main.__name__ = true;
vshaxeBuild_extension_Main.main = $hx_exports["activate"] = function(context) {
	new vshaxeBuild_extension_Main(context);
};
vshaxeBuild_extension_Main.prototype = {
	__class__: vshaxeBuild_extension_Main
};
var vshaxeBuild_extension_TaskProvider = function(projects,vshaxe) {
	this.projects = projects;
	this.vshaxe = vshaxe;
	Vscode.tasks.registerTaskProvider("vshaxe-build",this);
};
vshaxeBuild_extension_TaskProvider.__name__ = true;
vshaxeBuild_extension_TaskProvider.prototype = {
	provideTasks: function(token) {
		var tasks = [];
		var _g = 0;
		var _g1 = vshaxeBuild_project_ProjectList.getTargets(this.projects);
		while(_g < _g1.length) {
			var target = _g1[_g];
			++_g;
			if(target.name == "empty" || target.name == "vshaxe-node") {
				continue;
			}
			tasks.push(this.createTaskForTarget(target,false));
			if(!target.args.debug) {
				tasks.push(this.createTaskForTarget(target,true));
			}
		}
		return tasks;
	}
	,createTaskForTarget: function(target,debug) {
		var args = [];
		var suffix = "";
		if(!target.args.debug && debug) {
			args.push("--debug");
			suffix = " (debug)";
		}
		return this.createTask(target.name + suffix,target.name,debug,args);
	}
	,createTask: function(name,target,debug,additionalArgs) {
		var definition = { type : "vshaxe-build", target : name};
		var args = ["lix","run","vshaxe-build","--target",target];
		if(additionalArgs != null) {
			args = args.concat(additionalArgs);
		}
		if(this.vshaxe.displayPort != null && this.vshaxe.enableCompilationServer) {
			args = args.concat(["--connect",Std.string(this.vshaxe.displayPort)]);
		}
		var execution = new vscode_ShellExecution("npx",args,{ env : this.vshaxe.haxeExecutable.configuration.env});
		var task = new vscode_Task(definition,vscode_TaskScope.Workspace,name,"vshaxe-build",execution,vshaxe_ReadOnlyArray.get(this.vshaxe.problemMatchers));
		task.presentationOptions = this.vshaxe.taskPresentation;
		return task;
	}
	,resolveTask: function(task,token) {
		return task;
	}
	,__class__: vshaxeBuild_extension_TaskProvider
};
var vshaxeBuild_project_ArrayHandle = {};
vshaxeBuild_project_ArrayHandle.get = function(this1) {
	if(this1 == null) {
		return [];
	} else {
		return this1.slice();
	}
};
var vshaxeBuild_project_ProjectList = {};
vshaxeBuild_project_ProjectList.get = function(this1,i) {
	return this1[i];
};
vshaxeBuild_project_ProjectList.resolveTarget = function(this1,name) {
	var loop = null;
	loop = function(projects) {
		var _g = 0;
		var _g1 = projects;
		while(_g < _g1.length) {
			var project = _g1[_g];
			++_g;
			var target = vshaxeBuild_tools_ArrayTools.findNamed(project.targets,name);
			if(target != null) {
				return target;
			}
			var targetInSub = loop(project.subProjects);
			if(targetInSub != null) {
				return targetInSub;
			}
		}
		return null;
	};
	return loop(this1);
};
vshaxeBuild_project_ProjectList.resolveTargets = function(this1,names) {
	var _e = this1;
	var f = function(name) {
		return vshaxeBuild_project_ProjectList.resolveTarget(_e,name);
	};
	var result = new Array(names.length);
	var _g = 0;
	var _g1 = names.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = f(names[i]);
	}
	return result;
};
vshaxeBuild_project_ProjectList.resolveTargetHxml = function(this1,target,debug,flatten,display,recurse) {
	if(recurse == null) {
		recurse = true;
	}
	var hxmls = [target.args];
	if(debug) {
		hxmls.push(target.debug.args);
	}
	if(display) {
		hxmls.push(target.display.args);
	}
	if(recurse) {
		var _g = vshaxeBuild_project_ProjectList.resolveParent(this1,target);
		switch(_g._hx_index) {
		case 0:
			var parent = _g.v;
			if(parent != null) {
				var inheritedHxml = vshaxeBuild_project_ProjectList.resolveTargetHxml(this1,parent,debug,flatten,display,false);
				if(inheritedHxml != null) {
					hxmls.unshift(inheritedHxml);
				}
			}
			break;
		case 1:
			break;
		}
	}
	if(flatten) {
		var _this = vshaxeBuild_project_ProjectList.resolveTargets(this1,vshaxeBuild_project_ArrayHandle.get(target.targetDependencies));
		var _e = this1;
		var _g = function(target,debug,flatten,display,recurse) {
			return vshaxeBuild_project_ProjectList.resolveTargetHxml(_e,target,debug,flatten,display,recurse);
		};
		var debug1 = debug;
		var flatten1 = flatten;
		var display1 = display;
		var f = function(target) {
			return _g(target,debug1,flatten1,display1);
		};
		var result = new Array(_this.length);
		var _g1 = 0;
		var _g2 = _this.length;
		while(_g1 < _g2) {
			var i = _g1++;
			result[i] = f(_this[i]);
		}
		var dependencyHxmls = result;
		hxmls = hxmls.concat(dependencyHxmls);
	}
	return vshaxeBuild_tools_HxmlTools.mergeHxmls(hxmls,flatten,debug);
};
vshaxeBuild_project_ProjectList.resolveParent = function(this1,target) {
	if(target.inherit != null) {
		return haxe_ds_Option.Some(vshaxeBuild_project_ProjectList.resolveTarget(this1,target.inherit));
	}
	var _g = vshaxeBuild_project_ProjectList.getTargetOwner(this1,target);
	switch(_g._hx_index) {
	case 0:
		var project = _g.v;
		return haxe_ds_Option.Some(vshaxeBuild_project_ProjectList.resolveTarget(this1,project.inherit));
	case 1:
		throw haxe_Exception.thrown("unable to find owner of target " + target.name);
	}
};
vshaxeBuild_project_ProjectList.flattenProjects = function(this1,project) {
	var projects = [project];
	var array = vshaxeBuild_project_ArrayHandle.get(project.subProjects);
	var _e = this1;
	var callback = function(project) {
		return vshaxeBuild_project_ProjectList.flattenProjects(_e,project);
	};
	var result = new Array(array.length);
	var _g = 0;
	var _g1 = array.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = callback(array[i]);
	}
	projects = projects.concat(vshaxeBuild_tools_ArrayTools.flatten(result));
	return projects;
};
vshaxeBuild_project_ProjectList.getTargetOwner = function(this1,target) {
	var _g = 0;
	while(_g < this1.length) {
		var project = this1[_g];
		++_g;
		var flattened = vshaxeBuild_project_ProjectList.flattenProjects(this1,project);
		var _g1 = 0;
		while(_g1 < flattened.length) {
			var flattenedProject = flattened[_g1];
			++_g1;
			if(vshaxeBuild_tools_ArrayTools.findNamed(flattenedProject.targets,target.name) != null) {
				return haxe_ds_Option.Some(project);
			}
		}
	}
	return haxe_ds_Option.None;
};
vshaxeBuild_project_ProjectList.getTargets = function(this1) {
	var targets = [];
	var _g = 0;
	while(_g < this1.length) {
		var project = this1[_g];
		++_g;
		var _g1 = 0;
		var _g2 = vshaxeBuild_project_ArrayHandle.get(project.targets);
		while(_g1 < _g2.length) {
			var target = _g2[_g1];
			++_g1;
			targets.push(target);
		}
		targets = targets.concat(vshaxeBuild_project_ProjectList.getTargets(vshaxeBuild_project_ArrayHandle.get(project.subProjects)));
	}
	return targets;
};
var vshaxeBuild_project_ProjectLoader = function(cli) {
	this.cli = cli;
};
vshaxeBuild_project_ProjectLoader.__name__ = true;
vshaxeBuild_project_ProjectLoader.prototype = {
	load: function(vshaxeBuildDir,cwd) {
		this.cli.setCwd(vshaxeBuildDir);
		var defaults = this.toPlacedProject(vshaxeBuildDir,this.readProjectFile("vshaxe-build-defaults.json"));
		this.cli.setCwd(cwd);
		return [defaults,this.findProjectFiles()];
	}
	,findProjectFiles: function(dir) {
		if(dir == null) {
			dir = ".";
		}
		var lastDir = vshaxeBuild_tools_ArrayTools.idx(dir.split("/"),-1);
		if(this.isDirectoryIgnored(lastDir)) {
			return null;
		}
		var project = null;
		var subProjects = [];
		var _g = 0;
		var _g1 = js_node_Fs.readdirSync(dir);
		while(_g < _g1.length) {
			var file = _g1[_g];
			++_g;
			var fullPath = haxe_io_Path.join([dir,file]);
			if(sys_FileSystem.isDirectory(fullPath)) {
				var subProject = this.findProjectFiles(fullPath);
				if(subProject != null) {
					subProjects.push(subProject);
				}
			} else if(file == "vshaxe-build.json") {
				project = this.toPlacedProject(lastDir,this.readProjectFile(fullPath));
				this.adjustWorkingDirectories(project,dir);
			}
		}
		if(project != null) {
			project.subProjects = subProjects;
		}
		return project;
	}
	,isDirectoryIgnored: function(name) {
		if(["dump","node_modules"].indexOf(name) != -1) {
			return true;
		}
		if(name == "." || name == "..") {
			return false;
		}
		return StringTools.startsWith(name,".");
	}
	,readProjectFile: function(path) {
		this.cli.println("Reading project file '" + path + "'...");
		var parser = new JsonParser_$1();
		var json = parser.fromJson(js_node_Fs.readFileSync(path,{ encoding : "utf8"}),path);
		if(parser.errors.length > 0) {
			this.cli.fail(json2object_ErrorUtils.convertErrorArray(parser.errors));
		}
		return json;
	}
	,toPlacedProject: function(directory,project) {
		return { inherit : project.inherit, mainTarget : project.mainTarget, targets : project.targets, directory : directory, subProjects : []};
	}
	,adjustWorkingDirectories: function(project,baseDir) {
		var _g = 0;
		var _g1 = project.targets;
		while(_g < _g1.length) {
			var target = _g1[_g];
			++_g;
			var hxml = target.args;
			if(hxml != null) {
				hxml.workingDirectory = baseDir;
			}
			var hxml1 = target.debug.args;
			if(hxml1 != null) {
				hxml1.workingDirectory = baseDir;
			}
			var hxml2 = target.display.args;
			if(hxml2 != null) {
				hxml2.workingDirectory = baseDir;
			}
		}
	}
	,__class__: vshaxeBuild_project_ProjectLoader
};
var vshaxeBuild_tools_ArrayTools = function() { };
vshaxeBuild_tools_ArrayTools.__name__ = true;
vshaxeBuild_tools_ArrayTools.filterDuplicates = function(array,filter) {
	var unique = [];
	var _g = 0;
	while(_g < array.length) {
		var element = array[_g];
		++_g;
		var present = false;
		var _g1 = 0;
		while(_g1 < unique.length) {
			var unique1 = unique[_g1];
			++_g1;
			if(filter(unique1,element)) {
				present = true;
			}
		}
		if(!present) {
			unique.push(element);
		}
	}
	return unique;
};
vshaxeBuild_tools_ArrayTools.unique = function(array) {
	return vshaxeBuild_tools_ArrayTools.filterDuplicates(array,function(e1,e2) {
		return e1 == e2;
	});
};
vshaxeBuild_tools_ArrayTools.findNamed = function(a,name) {
	var _g = 0;
	var _g1 = vshaxeBuild_project_ArrayHandle.get(a);
	while(_g < _g1.length) {
		var e = _g1[_g];
		++_g;
		if(e.name == name) {
			return e;
		}
	}
	return null;
};
vshaxeBuild_tools_ArrayTools.idx = function(a,i) {
	if(i >= 0) {
		return a[i];
	} else {
		return a[a.length + i];
	}
};
vshaxeBuild_tools_ArrayTools.flatMap = function(array,callback) {
	var result = new Array(array.length);
	var _g = 0;
	var _g1 = array.length;
	while(_g < _g1) {
		var i = _g++;
		result[i] = callback(array[i]);
	}
	return vshaxeBuild_tools_ArrayTools.flatten(result);
};
vshaxeBuild_tools_ArrayTools.flatten = function(array) {
	return vshaxeBuild_tools_ArrayTools.reduce(array,function(acc,element) {
		return acc.concat(element);
	},[]);
};
vshaxeBuild_tools_ArrayTools.reduce = function(array,f,initial) {
	var _g = 0;
	while(_g < array.length) {
		var v = array[_g];
		++_g;
		initial = f(initial,v);
	}
	return initial;
};
var vshaxeBuild_tools_HxmlTools = function() { };
vshaxeBuild_tools_HxmlTools.__name__ = true;
vshaxeBuild_tools_HxmlTools.mergeHxmls = function(hxmls,flatten,debug) {
	var classPaths = [];
	var defines = [];
	var haxelibs = [];
	var macros = [];
	var debug1 = debug;
	var output = null;
	var deadCodeElimination = null;
	var noInline = false;
	var times = false;
	var main = null;
	var packageName = null;
	var merge = function(hxml) {
		if(hxml == null) {
			return;
		}
		var rawClassPaths = vshaxeBuild_project_ArrayHandle.get(hxml.classPaths);
		if(flatten) {
			var result = new Array(rawClassPaths.length);
			var _g = 0;
			var _g1 = rawClassPaths.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = haxe_io_Path.join([hxml.workingDirectory,rawClassPaths[i]]);
			}
			rawClassPaths = result;
		}
		classPaths = classPaths.concat(rawClassPaths);
		defines = defines.concat(vshaxeBuild_project_ArrayHandle.get(hxml.defines));
		haxelibs = haxelibs.concat(vshaxeBuild_project_ArrayHandle.get(hxml.haxelibs));
		macros = macros.concat(vshaxeBuild_project_ArrayHandle.get(hxml.macros));
		debug1 = debug1 || hxml.debug;
		if(hxml.output != null) {
			if(hxml.output.target != "interp" || output == null) {
				output = hxml.output;
			}
		}
		if(hxml.deadCodeElimination != null) {
			deadCodeElimination = hxml.deadCodeElimination;
		}
		if(hxml.noInline == true) {
			noInline = true;
		}
		if(hxml.times == true) {
			times = true;
		}
		if(hxml.main != null) {
			main = hxml.main;
		}
		if(hxml.packageName != null) {
			packageName = hxml.packageName;
		}
	};
	var _g = 0;
	while(_g < hxmls.length) {
		var hxml = hxmls[_g];
		++_g;
		merge(hxml);
	}
	return { workingDirectory : "", classPaths : classPaths, defines : defines, haxelibs : haxelibs, macros : macros, debug : debug1, output : output, deadCodeElimination : deadCodeElimination, noInline : noInline, times : times, main : main, packageName : packageName};
};
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
vshaxeBuild_project_ProjectLoader.PROJECT_FILE = "vshaxe-build.json";
vshaxeBuild_project_ProjectLoader.DEFAULTS_FILE = "vshaxe-build-defaults.json";
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=extension.js.map