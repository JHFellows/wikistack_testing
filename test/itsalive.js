const expect = require("chai").expect;
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

describe("adding function",function(){
  xit("adds 2 + 2",function(){
    var four = 2 + 2;
    expect(four).to.equal(4);
  })

});

describe("setTimeOut function",function(){
  xit("waits for the right amount of time", function(done){
    var startTime = Date.now();
    var endTime;
    setTimeout(function(){
      endTime = Date.now();
      //need expect in async function(can't get ref outside)
      expect(endTime - startTime).to.be.within(900,1100);
      done();
    },1000)
  })
})

describe("forEach",function(){
  xit("invokes its function once for every element",function(){
    var arr = [1,2,3,4];
    var func = function(elem){console.log(elem)};
    func = chai.spy(func);
    arr.forEach(func);
    expect(func).to.have.been.called.exactly(4);
  })
})
