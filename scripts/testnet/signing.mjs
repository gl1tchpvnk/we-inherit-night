import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir,userInfo} from 'node:os';
import {join} from 'node:path';
import {createHash,createPublicKey,verify} from 'node:crypto';
import assert from 'node:assert/strict';
import near from 'near-api-js';

const exec=promisify(execFile);
export const CONTRACT='night.we-inherit-night.testnet';
export const RPC='https://test.rpc.fastnear.com';
export const GAS='10000000000000';
export const gasForMethod=method=>['claim_rent','refund_passage_budget','open_campaign'].includes(method)?'50000000000000':GAS;
export async function rpc(method,params){
  const response=await fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:'night',method,params}),signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw new Error('Testnet RPC unavailable; transaction status may be pending');
  return response.json();
}
export async function result(method,params){const r=await rpc(method,params);if(r.error)throw new Error('Testnet query failed');return r.result;}

// Reuse Pass 4B.2-FIX: exact keychain lookup in OFFLINE mode, never the CLI's
// online FullAccess auto-selection. Only public signed data leaves the CLI.
export function verifySigned(payload,expected){
  const bytes=Buffer.from(payload,'base64');
  const signed=near.transactions.SignedTransaction.decode(bytes),tx=signed.transaction;
  assert.deepEqual(Object.keys(tx.publicKey),['ed25519Key']);
  assert.deepEqual(Object.keys(signed.signature),['ed25519Signature']);
  const publicBytes=Buffer.from(tx.publicKey.ed25519Key.data);
  const publicKey='ed25519:'+near.utils.serialize.base_encode(publicBytes);
  assert.equal(publicKey,expected.publicKey);assert.equal(tx.signerId,expected.accountId);
  assert.equal(tx.receiverId,CONTRACT);assert.equal(tx.nonce.toString(),String(expected.nonce));
  assert.equal(near.utils.serialize.base_encode(Buffer.from(tx.blockHash)),expected.blockHash);
  assert.equal(tx.actions.length,1);assert.deepEqual(Object.keys(tx.actions[0]),['functionCall']);
  const call=tx.actions[0].functionCall;
  assert.equal(call.methodName,expected.method);assert.deepEqual(JSON.parse(Buffer.from(call.args).toString()),expected.args);
  assert.equal(call.deposit.toString(),'0');assert.equal(call.gas.toString(),gasForMethod(expected.method));
  // Ed25519 signature is the final enum byte + 64 bytes in this NEAR encoding.
  assert.equal(bytes.at(-65),0);
  const hash=createHash('sha256').update(bytes.subarray(0,-65)).digest();
  const key=createPublicKey({key:Buffer.concat([Buffer.from('302a300506032b6570032100','hex'),publicBytes]),format:'der',type:'spki'});
  assert(verify(null,hash,key,Buffer.from(signed.signature.ed25519Signature.data)));
  return {payload,hash:near.utils.serialize.base_encode(hash),publicKey};
}

export function createKeychainSigner({cli,provisioningUsername,runtimeUsername}){
  // Windows keychain custody is per OS identity, not per config file. Refuse
  // execution as the provisioning user; copying a public key is not isolation.
  if(process.platform!=='win32'||!cli||!runtimeUsername||!provisioningUsername||runtimeUsername.toLowerCase()===provisioningUsername.toLowerCase()||userInfo().username.toLowerCase()!==runtimeUsername.toLowerCase())throw new Error('A separate Windows runtime identity/keychain is required; provisioning identity is forbidden');
  return async(expected)=>{
    const directory=await mkdtemp(join(tmpdir(),'night-signed-'));
    try{
      const file=join(directory,'transaction.json');
      let output;
      try{output=await exec(cli,['--offline','contract','call-function','as-transaction',CONTRACT,expected.method,'json-args',JSON.stringify(expected.args),'prepaid-gas',String(BigInt(gasForMethod(expected.method))/1000000000000n)+' Tgas','attached-deposit','0 NEAR','sign-as',expected.accountId,'network-config','testnet','sign-with-keychain','--signer-public-key',expected.publicKey,'--nonce',String(expected.nonce),'--block-hash',expected.blockHash,'--block-height',String(expected.blockHeight),'save-to-file',file],{windowsHide:true,timeout:60000,maxBuffer:128*1024});}
      catch{throw new Error('Offline runtime signing failed; no transaction broadcast');}
      if(/legacy/i.test(output.stdout+output.stderr))throw new Error('Credential fallback forbidden');
      return verifySigned(JSON.parse(await readFile(file,'utf8')).signed_transaction_as_base64,expected);
    }finally{await rm(directory,{recursive:true,force:true});}
  };
}

// The protected environment contains runtime FunctionCall keys only. The caller
// verifies the exact on-chain permission before this offline signer is invoked.
export function createEnvironmentSigner(credentials, roster){
  try{
    const records=JSON.parse(credentials);
    if(!Array.isArray(records)||records.length!==Object.keys(roster).length)throw new Error();
    const keys=new Map();
    for(const [role,actor] of Object.entries(roster)){
      const matches=records.filter(r=>r.role===role&&r.accountId===actor.accountId);
      if(matches.length!==1)throw new Error();
      const key=near.KeyPair.fromString(matches[0].privateKey);
      if(key.getPublicKey().toString()!==actor.publicKey||keys.has(actor.accountId))throw new Error();
      keys.set(actor.accountId,key);
    }
    return async expected=>{
      try{
        const key=keys.get(expected.accountId);
        if(!key||key.getPublicKey().toString()!==expected.publicKey)throw new Error();
        const signer=await near.InMemorySigner.fromKeyPair('testnet',expected.accountId,key);
        const tx=near.transactions.createTransaction(expected.accountId,key.getPublicKey(),CONTRACT,expected.nonce,
          [near.transactions.functionCall(expected.method,expected.args,BigInt(gasForMethod(expected.method)),0n)],
          near.utils.serialize.base_decode(expected.blockHash));
        const [,signed]=await near.transactions.signTransaction(tx,signer,expected.accountId,'testnet');
        return verifySigned(Buffer.from(signed.encode()).toString('base64'),expected);
      }catch{throw new Error('Restricted runtime signing failed');}
    };
  }catch{throw new Error('Invalid restricted runtime credentials or roster');}
}
