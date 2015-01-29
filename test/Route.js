var after = require('after');
var should = require('should');
var express = require('../')
  , Route = express.Route
  , methods = require('methods')
  , assert = require('assert');

describe('Route', function(){
  describe('.all', function(){
    it('should add handler', function(done){
      var req = { method: 'GET', url: '/'};
      var route = new Route('/burrito');

      route.all(function(req, res, next){
        req.called = true;
        next();
      });

      route.dispatch(req, {}, function(err){
        if (err) return done(err);
        should(req.called).be.ok;
        done();
      });
    })

  })
})