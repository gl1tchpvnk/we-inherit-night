// Opt-in local diagnostics. Values contain durations and labels, never credentials.
export const startupTrace=[];
export const moduleStarted=performance.now();
export function markDuration(label,start){if(process.env.NIGHT_STARTUP_PROFILE==='1')startupTrace.push({label,ms:Math.round((performance.now()-start)*10)/10});}
export async function timed(label,operation){
  const start=performance.now();
  try{return await operation();}
  finally{if(process.env.NIGHT_STARTUP_PROFILE==='1')startupTrace.push({label,ms:Math.round((performance.now()-start)*10)/10});}
}
