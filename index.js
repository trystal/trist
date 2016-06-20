'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.textToChain = textToChain;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

var _trist = require('trist');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fnLeaderLen = function fnLeaderLen(leader) {
  return leader.replace(/\t/g, "    ").length;
};

var fnMatchToSplit = function fnMatchToSplit(id, _ref) {
  var _ref2 = _slicedToArray(_ref, 3);

  var leader = _ref2[1];
  var trystup = _ref2[2];
  return { id: id, leader: leader, trystup: trystup };
};
var fnSplitOne = function fnSplitOne(str, idFactory, index) {
  return fnMatchToSplit(idFactory(index), str.match(/^(\s*)(.*$)/));
};

var fnLevelKeys = function fnLevelKeys(leaders) {
  return (0, _lodash.uniq)(leaders).sort(function (a, b) {
    return fnLeaderLen(a) - fnLeaderLen(b);
  });
};
var fnLevels = function fnLevels(splitted, levelKeys) {
  return splitted.reduce(function (accum, item) {
    var id = item.id;
    var leader = item.leader;

    accum[id] = levelKeys.indexOf(leader);
    return accum;
  }, {});
};

function textToChain(text, fnNextId) {
  var strs = text.split(/[\r\n]+/).filter(function (str) {
    return str.length;
  }); // [str,str,...]
  var splitted = strs.map(function (str, index) {
    return fnSplitOne(str, fnNextId, index);
  }); // [{id,leader,trystup},{id,leader,trystup}...]
  var levelKeys = fnLevelKeys(splitted.map(function (item) {
    return item.leader;
  })); // ["", "  ", "    "]
  var levels = fnLevels(splitted, levelKeys); // [1,0,...]
  var payloads = splitted.map(function (_ref3) {
    var id = _ref3.id;
    var trystup = _ref3.trystup;
    return { id: id, trystup: trystup };
  }); // [{id,trystup},{id,trystup},...]
  var chain = (0, _trist.chainify)(payloads, levels); // [{id,next,prev,NV,PV,rlevel},{...},...]
  return (0, _trist.collapseAll)(chain, function (id) {
    return levels[id];
  }); // {N1:{id,prev,next,PV,NV,rlevel},N2:{...},...}
}
