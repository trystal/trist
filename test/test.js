/*eslint-env jasmine */
import _, {repeat, isNumber, isString} from 'lodash'
import {textToChain} from '../src/trist-text'
import {chainOps} from 'trist'

const factory = levels => {
  const words = "zero one two three four five six seven eight nine ten".split(' ') 
  return levels.split('')
  .map(strLevel => parseInt(strLevel))
  .map(level => repeat(' ',level) + words[level])
  .join('\n')
}

const dump = chain => {
  const numberOrDash = n => isNumber(n) ? n.toString() : '-'
  const stringOrDash = s => isString(s) ? s : '-'
  const cops = chainOps(chain)
  const head = cops.head() 
  return {
    rlevels : cops.rlevels(head).map(rlevel => numberOrDash(rlevel)).join(''),
    PVs     : cops.pvids(head).map(pvid => stringOrDash(pvid)).join(''),
    NVs     : cops.nvids(head).map(nvid => stringOrDash(nvid)).join(''),
  }
}

describe('collapseEmAll tests', function() {
  it('tests the main test case for collapseEmAll', () => {
    const text = factory('1133221100')
    const chain = textToChain(text, index => index.toString())
    const result = dump(chain) 
    expect(result.rlevels).toEqual('1020-1000-10')
    expect(result.PVs).toEqual('-0-2341678')
  })
})
