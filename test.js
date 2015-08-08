(function () {
    var mocha = require('mocha');
    var should = require('should');
    var paramatcher = require('./index');

    var someConditions, exampleLiteral;

    describe('Test condition creation', function () {
	"use strict";

	describe('Test functionality', function () {
	    beforeEach(function (done) {
		setupMockData();
		done();
	    });
	    
	    it ('parses syntax into expected object format', function (done) {
		var rule = paramatcher
		    .build('project && (id || (name && year))');

		rule.getDefinition().$and[0]
		    .should.equal(exampleLiteral.$and['0']);

		rule.getDefinition().$and[1].$or[0]
		    .should.equal(exampleLiteral.$and['1'].$or[0]);

		done();
	    });

	    it ('Works with literal match defintion object', function (done) {
		done();
	    });

	    it ('Simple rule tests conditions with expected results', function (done) {
		var rule = paramatcher.build('project && (id || (name && year))');
		rule.success.should.equal(true);
		var testables = [
		    { project : 'ABC', id: 123, expected : true },
		    { project : 'ABC', idx: 123, expected : false },
		    { project : 'ABC', name: 'Joe', year : 1923, expected : true }
		];

		testables.forEach(function (t) {
		    rule.test(t).should.equal(t.expected);
		});

		done();
	    });
	});

	describe('Malformed inputs and error reporting', function () {
	    it('must have correct number of tokens', function (done) {
		paramatcher.build('one').success.should.equal(true);
		paramatcher.build('one && two').success.should.equal(true);
		paramatcher.build('one && two three').success.should.equal(false);
		done();
	    });
	    it('Must not mix boolean operators of different types ', function () {
		paramatcher.build('one').success.should.equal(true);
		paramatcher.build('one && two').success.should.equal(true);
		paramatcher.build('one && two && three').success.should.equal(true);
		paramatcher.build('one || two || four').success.should.equal(true);
		paramatcher.build('one && two || four').success.should.equal(false);
	    });
	    it ('Ignores extra layers of parenthesis', function (done) {
		paramatcher.build('one').success.should.equal(true);
		paramatcher.build('(one)').success.should.equal(true);
		paramatcher.build('((one))').success.should.equal(true);
		paramatcher.build('one && (three && two)')
		    .test({one: 1, two: 2, three : 3})
		    .should.equal(true);
		paramatcher.build('one && (((three && two)))')
		    .test({one: 1, two: 2, three : 3})
		    .should.equal(true);
		paramatcher.build('((three && two))')
		    .test({one: 1, two: 2, three : 3})
		    .should.equal(true);

		done();
	    });
	});
    });

    function setupMockData () {
	var checklists = {
	    passLists : [
		[ 'protocol', 'age', 'id'],
		[ 'protocol', 'name', 'year', 'month' ]
	    ],
	    failLists : [
		[ 'age', 'id'],  // protocol forgotten
		[ 'protocol', 'name', 'year', 'id' ] // conditions are or-ed but not in allow list
	    ]
	};

	exampleLiteral = {
	    $and : [
		'project', 
		{ 
		    $or : [
			'id',
			{ $or : ['name', 'year'] }
		    ]
		}
	    ],
	    $allow : ['age', 'month', 'year']
	};
    }

}());
