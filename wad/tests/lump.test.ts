import { Lump, LumpData } from '../src/lumps/lump';
import { test } from 'ava';



test('AVA run TypeScript without tsc', t => {
  let lumpData : LumpData = new LumpData();
  lumpData.name = 'toto';

  let lump : Lump = new Lump(lumpData, new ArrayBuffer(2));

  t.is(lump.getName(), <string>'toto', 'lump\'s name');
});

test('test lump with lump\'s name is null', t => {

})