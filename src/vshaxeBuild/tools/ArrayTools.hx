package vshaxeBuild.tools;

class ArrayTools {
	public static function filterDuplicates<T>(array:Array<T>, filter:T->T->Bool):Array<T> {
		var unique:Array<T> = [];
		for (element in array) {
			var present = false;
			for (unique in unique)
				if (filter(unique, element))
					present = true;
			if (!present)
				unique.push(element);
		}
		return unique;
	}

	public static inline function unique<T>(array:Array<T>):Array<T> {
		return filterDuplicates(array, (e1, e2) -> e1 == e2);
	}

	public static function findNamed<T:Named>(a:ArrayHandle<T>, name:String):T {
		for (e in a.get())
			if (e.name == name)
				return e;
		return null;
	}

	public static function idx<T>(a:Array<T>, i:Int) {
		return if (i >= 0) a[i] else a[a.length + i];
	}

	/** from https://github.com/fponticelli/thx.core/blob/master/src/thx/Arrays.hx **/
	inline public static function flatMap<TIn, TOut>(array:Array<TIn>, callback:TIn->Array<TOut>):Array<TOut>
		return flatten(array.map(callback));

	public static function flatten<T>(array:Array<Array<T>>):Array<T>
		return reduce(array, function(acc:Array<T>, element) return acc.concat(element), []);

	public static function reduce<A, B>(array:Array<A>, f:B->A->B, initial:B):B {
		for (v in array)
			initial = f(initial, v);
		return initial;
	}
}
