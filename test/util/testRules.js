var _ = require('lodash');
var validator = require('../../index.js');

// Test a rule given a deliberate example and nonexample
// Test WITH and WITHOUT callback
module.exports = function testRules (rules, example, nonexample) {

  // Throw an error if there's any trouble
  // (not a good production usage pattern-- just here for testing)
  var exampleOutcome, nonexampleOutcome;

  // Should be falsy
  exampleOutcome = validator(example).to(rules);

  // Should be an array
  nonexampleOutcome = validator(nonexample).to(rules);

  if (exampleOutcome) {
    return gotErrors('Valid input marked with error!', exampleOutcome, example);
  }
  if (!_.isArray(nonexampleOutcome)) {
    return gotErrors('Invalid input (' + nonexample + ') allowed through.', rules, nonexample);
  }

  function gotErrors (errMsg, err, data) {
    throw new Error(errMsg);
  }
};
