import type {Campaign,GameAction,Availability,inspectRights} from './game';
export interface Grant { id:number; property_id:string; scope:string; grantor:string; grantee:string; parent_grant_id:number|null; can_delegate:boolean; expiry_night:number|null; revoked:boolean }
export interface Lease {id:number;property_id:string;owner:string;buyer:string;price_yocto:string;duration_nights:number;offer_expiry_night:number;status:string;end_night:number|null;escrow_yocto:string;payout_pending:boolean;settled:boolean}
export interface Transaction {action:string;actor:string;property:string;hash:string;success:boolean;status:unknown;gasBurnt:string;executionStatus?:string}
export interface World {passage_budget?:{seller:string;remaining:string;expiry_night:number;lease_id:number|null}|null;night:number; properties:{id:string;owner:string}[]; ancestry:{sire:string;descendant:string}[]; grants:Grant[]; grant_validity?:boolean[]; leases:Lease[]; access:Record<string,boolean>; next_nonce:number}
export interface Result {actions?:Availability[];authority?:ReturnType<typeof inspectRights>;availability?:{accept:string[];reject:string[];end_night:string[];rooms:Record<string,string|null>};pending?:boolean;campaign?:Campaign;world:World; error:string|null; events:string[]; proof:string;phase?:string;walletYocto?:string;escrowYocto?:string;transactions?:Transaction[]}
export type Action = {action:'agreement_accept'|'agreement_reject'|'game'|'end_night'|'view'|'reset'|'grant'|'revoke'|'enter'|'accept'|'reject'|'continue'|'settle';property_id?:string;choice?:GameAction;campaign_id?:string;revision?:number;agreement_id?:string};
export interface ChainAdapter { readonly mode:'local'|'testnet'|'sandbox'; request(action:Action):Promise<Result> }
export const mode = import.meta.env.VITE_MODE ?? 'sandbox';
export const adapter:ChainAdapter = {
  mode: mode === 'testnet' ? 'testnet' : mode==='local'?'local':'sandbox',
  async request(action) {
    if (!['local','sandbox','testnet'].includes(mode)) throw new Error('Unsupported mode');
    if (mode !== 'testnet') {
      const response=await fetch('/api/demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(action),signal:AbortSignal.timeout(180000)});
      const result=await response.json();
      if (!response.ok || !result.world) throw new Error(result.error || 'Local runtime unavailable');
      return result as Result;
    }
    if (action.action !== 'view') throw new Error('Wallet disconnected: signing is not implemented in M1');
    const contract=import.meta.env.VITE_CONTRACT_ID;
    const account=import.meta.env.VITE_VIEW_ACCOUNT_ID;
    const rpc=import.meta.env.VITE_RPC_URL ?? 'https://rpc.testnet.near.org';
    if (!contract?.endsWith('.testnet') || !account?.endsWith('.testnet')) throw new Error('Configure testnet contract and view account IDs');
    if (rpc !== 'https://rpc.testnet.near.org') throw new Error('M1 allows only the official testnet RPC');
    const response=await fetch(rpc,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:'world',method:'query',params:{request_type:'call_function',finality:'final',account_id:contract,method_name:'get_world',args_base64:btoa(JSON.stringify({account_id:account}))}}),signal:AbortSignal.timeout(15000)});
    const data=await response.json();
    if (!response.ok || data.error || data.result?.error || !Array.isArray(data.result?.result)) throw new Error('Testnet view failed; access remains unknown');
    return {world:JSON.parse(new TextDecoder().decode(new Uint8Array(data.result.result))),error:null,events:[],proof:'testnet-rpc-view'};
  }
};


