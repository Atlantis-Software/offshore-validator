var _ = require('lodash');
var validator = require('../index.js');
var assert = require("assert");

describe('Custom Types', function() {

  describe('Single Definition', function() {
    it(' should properly validate a simple object with a custom type', function() {
      var rules = {
        houseNumber: 'five'
      };

      var example = {
        houseNumber: 5
      };

      var isfive = function(val){
        return val === 5;
      };

      assert.equal(false, validator(example).define("five", isfive).to({type:rules}));
    });
  });

  describe('Dictonary of Definitions', function() {
    it(' should properly validate a simple object with a custom type', function() {
      var rules = {
        houseNumber: 'five',
        fish: 'yummyFish'
      };

      var example = {
        houseNumber: 5,
        fish: 'tuna'
      };

      var definition = {
        five: function(val){
          return val === 5;
        },
        yummyFish: function(val){
          return val === "tuna";
        }
      };

      assert.equal(false, validator(example).define(definition).to({type:rules}));
    });
  });

  describe('Context', function() {
    it(' should support providing context for rules via',function () {
      var user = { password: 'passW0rd', passwordConfirmation: 'passW0rd' };

      validator.define('password', function (password) {
        return password === this.passwordConfirmation;
      });

      var outcome = validator(user.password).to({ type: 'password' }, user);

      assert.equal(false, outcome);
    });
  });
});
