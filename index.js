'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapEm = mapEm;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapEm() {
  var nodes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  var stack = [];
  var getPV = function getPV(level) {
    var popped = null;
    while (stack.length > 0 && _lodash2.default.last(stack).level >= level) {
      popped = stack.pop();
    }return popped;
  };
  var getPredLevel = function getPredLevel(PV, index) {
    if (PV) return PV.level;
    if (index > 0) return nodes[index - 1].level;
    return 0;
  };
  return nodes.reduce(function (accum, _ref, index) {
    var level = _ref.level;

    var PV = getPV(level);
    accum.push({
      PV: PV ? PV.index : null,
      rlevel: level - getPredLevel(PV, index)
    });
    stack.push({ index: index, level: level });
    return accum;
  }, []);
  // [PV:nn,rlevel:nn]
}

// nodes[A1,B1,C3,D3,E2,F2,G1,H1,I0]
//
// STACK     []
// ======================
// NODE-A1:       level     = 1
//                PV        = (stack,level) => ---  
//                predLevel = (PV,0) => 0
//                rlevel    = (level - predlevel) => 1 - 0 => 1
//                PVI       = PV == null => null
// ======================
// RESULT:   [{PVI:null, rlevel: 1}]
// STACK:    [{index:0,level:1}]  
// ======================
// NODE-B1:       level     = 1
//                PV        = (stack,level) => {index:0,level:1}
//                predLevel = (PV,1) => PV.level => 1
//                rlevel    = (level - predlevel) => 1 - 1 => 0
//                PVI       = PV => PV.index 0
// ======================
// RESULT:   [{PVI:null, rlevel: 1},{PVI:0, rlevel: 0}]
// STACK:    [{index:1, level:1}]  
// ======================
// function getPV(stack, level) {
//   let popped = null
//   while(stack.length > 0 && _.last(stack).level >= level) popped = stack.pop()
//   return popped
// }
// ======================
// NODE-C3:       level     = 3, index = 2
//                PV        = (stack,level=3) => null
//                predLevel = (PV,index) => nodes[index-1].level => 1
//                rlevel    = (level - predlevel) => 3 - 1 => 2
//                PVI       = PV => null 
// RESULT:   [{PVI:null, rlevel: 1},{PVI:0, rlevel: 0},{PVI:null, rlevel:2}]
// STACK:    [{index:1, level:1},{index:2,level:3}]  
// ======================
// NODE-D3:       level     = 3, index = 3
//                PV        = (stack,level=3) => {index:2,level:3}
//                predLevel = (PV,index) =>   PInodes[index-1].level => 1
//                rlevel    = (level - predlevel) => 3 - 1 => 2
//                PVI       = PV => null 
// RESULT:   [{PVI:null, rlevel: 1},{PVI:0, rlevel: 0},{PVI:null, rlevel:2}]
// STACK:    [{index:1, level:1}]  
// ======================

// node A2: PV = {index:0,level:1}   STACK: [{index:1,level:1}]  rlevel = (1 - ({0,1},1)) => 1 - 1 => 0, PVI = 0
// node A3: Pv =   

// result [
//   {PVI:null, rlevel: 1}
//   {PVI:0     rlevel: 0}
// ]

// --A1
// --A2
// ------B1
// ------B2
// ----B3
// --- B4
// --A3
// --A4
// A5
