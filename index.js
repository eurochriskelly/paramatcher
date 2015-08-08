var Paramatcher = function () {
    
    return {
	build : _build
    };
    
    function _build (str) {
	var replacements = Array.prototype.slice.call(arguments).slice(1);
	var exprStore = [];
	var definition = {};
	var WARNINGS = [];

	replacements.forEach(function (r) {
	    str.replace('?', r );
	});
	
	var rule = _parse('(' + str + ')');
	var allowp = '';

	return {
	    update : _build,
	    test : _test,
	    success : SUCCESS,
	    warnings : WARNINGS,
	    getDefinition : _getDefinition
	};
	
	function _getDefinition () {
	    return definition;
	}
	function _parse (str) {
	    try {
		var res = getInnerMostExpression(str, '?0');
		while (res.length) {
		    var obj = genNotation(res[1]);
		    exprStore.push(obj);
		    var res = getInnerMostExpression(res[0], '?' + exprStore.length);
		}
		definition = exprStore.pop();
		SUCCESS = true;
	    }
	    catch (e) {
		WARNINGS.push(e);
		SUCCESS = false;
	    }

	    function genNotation (str) {
		var tokens = str.split(' ')
		    .filter(function removeBlanks (t) { return t; })

		if (tokens.length === 1) return checkToken(tokens[0]);
		if (tokens.length % 2 - 1) 
		    throw new Error('There must be an odd number of tokens. eg. X || Y. Found ' + tokens.length);

		var operatorsAreSame = tokens
		    .filter(function oddEntries (t, i) { return i % 2; })
		    .reduce(function homogenous (p, n) {
			return (p === n) ? p : false;
		    }, tokens[1]);

		if (!operatorsAreSame)
		    throw new Error('Booelan operators must be the same in group');
		
		var rest = tokens
		    .filter(function oddEntries(t, i) { return i % 2 -1; })
		    .map(checkToken);

		switch (tokens[1]) {
		    
		case '||':
		    return { $or : rest};
		    
		case '&&':
		    return { $and : rest};

		default:
		    throw new Error('Unknown boolean operator ' + tokens[1]);
		    break;
		}
		
		function checkToken(t) { 
		    if (t[0] !== '?') return t;
		    return exprStore[+t.substr(1)];
		}
	    }
	    function getInnerMostExpression (str, block) {
		if (nextOpeningBracked = lastIndexOf(str, '(')+1) {
		    var rem = str.substring(nextOpeningBracked);
		    var nextClosingBracket = rem.indexOf(')');
		    if (nextClosingBracket === -1) return [];
		    var contents = rem.substring(0, nextClosingBracket);
		    var newstr = str.replace('(' + contents + ')', block);
		    return [newstr, contents];
		} 
		return [];
	    }
	}
	function _test (obj) {
	    return traverseDefininition (definition);
	    
	    function traverseDefininition (def) {
		
		if (def.$or) {
		    accept = false;
		    def.$or.forEach(function (orable) {
			if (typeof orable === 'string') {
			    accept = accept || (Object.keys(obj).indexOf(orable) > -1);
			} else {
			    accept = accept || traverseDefininition(orable);
			}
		    });
		    return accept;
		} 

		if (def.$and) {
		    accept = true;
		    def.$and.forEach(function (andable) {
			if (typeof andable === 'string') {
			    accept = accept && (Object.keys(obj).indexOf(andable) > -1);
			} else {
			    accept = accept && traverseDefininition(andable);
			}
		    });
		    return accept;
		}
	    }
	}
    }
    function isKeyword(token) {
	return ['$or', '$and', '$allow'].indexOf(token);
    }
    function lastIndexOf (n,r,t) {
    	// borrowed from lodash
	var e=n?n.length:0;
	for(typeof t=="number"&&(e=(0>t?Mr(0,e+t):$r(t,e-1))+1);e--;)if(n[e]===r)return e;
	return-1
    }
    function _getDefinition () {
	return definition;
    }
}();

module.exports = Paramatcher;

