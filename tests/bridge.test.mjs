import test from 'node:test';
import assert from 'node:assert/strict';
import {createBridge} from '../scripts/bridge.mjs';

test('actual Rust contract bridge: grant, enter, revoke, deny, independent title, reload', async () => {
  const bridge=createBridge();
  try {
    let r=await bridge.request({action:'view'});
    assert.equal(r.proof,'local-sdk-runtime');
    assert.equal(r.world.access.crypt,false);assert.equal(r.world.access.library,true);
    r=await bridge.request({action:'enter',property_id:'crypt'});
    assert.match(r.error,/access denied/);assert.equal(r.world.next_nonce,0);
    r=await bridge.request({action:'grant'});assert.equal(r.error,null);assert.equal(r.world.access.crypt,true);
    r=await bridge.request({action:'enter',property_id:'crypt'});assert.equal(r.error,null);assert.equal(r.world.next_nonce,1);
    r=await bridge.request({action:'revoke'});assert.equal(r.error,null);assert.equal(r.world.access.crypt,false);
    r=await bridge.request({action:'enter',property_id:'crypt'});assert.match(r.error,/access denied/);
    assert.equal(r.world.next_nonce,1);assert.equal(r.events.length,0);
    r=await bridge.request({action:'enter',property_id:'library'});assert.equal(r.error,null);
    r=await bridge.request({action:'grant'});assert.match(r.error,/already issued/);
    r=await bridge.request({action:'view'});assert.equal(r.world.access.crypt,false);assert.equal(r.world.access.library,true);
    assert.equal(r.world.grants[0].revoked,true);assert.equal(r.world.ancestry.length,1);
  } finally {bridge.close();}
});
