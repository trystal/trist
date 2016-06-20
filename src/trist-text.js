import Immutable from 'immutable'
import {times,uniq} from 'lodash'
import {chainify,collapseAll} from 'trist'

const fnLeaderLen    = leader => leader.replace(/\t/g,"    ").length

const fnMatchToSplit = (id,[,leader,trystup]) => ({id,leader,trystup})
const fnSplitOne     = (str,idFactory,index) => fnMatchToSplit(idFactory(index),str.match(/^(\s*)(.*$)/))

const fnLevelKeys    = leaders => uniq(leaders).sort((a,b) => fnLeaderLen(a)-fnLeaderLen(b))
const fnLevels       = (splitted, levelKeys) => splitted.reduce((accum, item) => {
  const {id, leader} = item  
  accum[id] = levelKeys.indexOf(leader)
  return accum 
},{})

export function textToChain(text, fnNextId) {
  const strs      = text.split(/[\r\n]+/).filter(str => str.length)           // [str,str,...]
  const splitted  = strs.map((str,index) => fnSplitOne(str,fnNextId, index))  // [{id,leader,trystup},{id,leader,trystup}...]
  const levelKeys = fnLevelKeys(splitted.map(item => item.leader))            // ["", "  ", "    "]
  const levels    = fnLevels(splitted, levelKeys)                             // [1,0,...]
  const payloads  = splitted.map(({id,trystup}) => ({id,trystup}))            // [{id,trystup},{id,trystup},...]
  const chain     = chainify(payloads, levels)                                // [{id,next,prev,NV,PV,rlevel},{...},...]
  return collapseAll(chain, id => levels[id])  // {N1:{id,prev,next,PV,NV,rlevel},N2:{...},...}
}

