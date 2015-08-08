- Allow passing the mongodb-like internal representation of the rule directly
  e.g. 

  var rule = paramatcher.build({ $or : [ 'param1', 'param2'] });

- Allow string parameters to be replaced by more complex conditions using for example "criterion".

  e.g.

  var rule = paramatcher.build({ $or : [ { param1 : { $lt : 20, $gt : 5 }}, 'param2']})	
  or
  var rule = paramatcher.build("name && ? && (year || age)", { param1 : { $lt : 20, $gt : 5 }});