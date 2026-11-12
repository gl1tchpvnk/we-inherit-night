import {createBridge} from '../bridge.mjs';
import {writeFile,mkdir} from 'node:fs/promises';
const directory=process.argv[2];
if(!directory?.startsWith('.local/startup-'))throw new Error('Use an isolated .local/startup-* directory');
const bridge=createBridge('sandbox',{saveDir:directory,disableLlm:true,profile:true});
const measurements=[];
try{
 for(const stage of ['initial','reset']){
  const start=performance.now();
  const previous=measurements.at(-1)?.result;
  const result=await bridge.request(stage==='initial'?{action:'view'}:{action:'reset',campaign_id:previous.campaign.id,revision:previous.campaign.revision});
  if(result.error||result.pending)throw new Error(result.error??'Pending initialization');
  const record={stage,ms:Math.round(performance.now()-start),timings:result.startupTimings,transactions:result.transactions.length,npcTurns:result.campaign.agentHistory?.length??0};
  console.log(JSON.stringify(record));measurements.push({...record,result});
 }
 await mkdir(directory,{recursive:true});
 await writeFile(`${directory}/measurements.json`,JSON.stringify(measurements.map(({result,...record})=>record),null,2));
}finally{bridge.close();}
