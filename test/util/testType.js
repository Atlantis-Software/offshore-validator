var _ = require('lodash');
var validator = require('../../index.js');

// Test a rule given a deliberate example and nonexample
// Test WITH and WITHOUT callback
module.exports = function testType (rule, example, nonexample) {

  // Throw an error if there's any trouble
  // (not a good production usage pattern-- just here for testing)
  var exampleOutcome, nonexampleOutcome;

  // Should be falsy
  exampleOutcome = validator(example).to({
    type: rule
  });

  // Should be an array
  nonexampleOutcome = validator(nonexample).to({
    type: rule
  });

  if (exampleOutcome) {
    return gotErrors(exampleOutcome);
  }
  if (!_.isArray(nonexampleOutcome)) {
    return gotErrors('Invalid input (' + nonexample + ') allowed through as a ' + rule + '.');
  }

  function gotErrors (err) {
    console.error('*****************');
    console.error('err', err);
    console.error('nonexampleOutcome', nonexampleOutcome);
    console.error('nonexample', nonexample);
    console.error('rule', rule);
    throw new Error(err);
  }
};
