import {readFile,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';

// Title-screen inspection must never start a runner, migrate a save or recover a journal.
export async function inspectSave(base=process.env.NIGHT_SAVE_DIR??'.local/night-play'){
  let current;
  try{current=JSON.parse(await readFile(join(resolve(base),'current.json'),'utf8'));}
  catch(error){return error.code==='ENOENT'?{exists:false,valid:false}:{exists:true,valid:false,error:'The saved campaign index could not be read.'};}
  try{
    if(typeof current.id!=='string'||!/^[0-9a-f-]{36}$/.test(current.id))throw new Error();
    const home=join(resolve(base),current.id);
    const [ready,saved]=await Promise.all(['ready.json','campaign.json'].map(async name=>JSON.parse(await readFile(join(home,name),'utf8'))));
    const c=saved.campaign;
    if(ready.id!==current.id||c?.id!==current.id||![undefined,2,3].includes(c.version)||!Number.isInteger(c.revision)||c.revision<0||!Number.isInteger(c.actionsLeft)||!Array.isArray(c.events)||!Number.isInteger(c.night)||c.night<0||c.night>7||!c.resources||!Number.isFinite(c.resources.blood)||!Number.isFinite(c.resources.exposure)||!['vesper','seraphine','lucien'].every(actor=>c.npcs?.[actor]?.relationships))throw new Error();
    await Promise.all(['config.json','data','keys'].map(name=>access(join(home,name))));
    return {exists:true,valid:true,id:c.id,night:c.night};
  }catch{return {exists:true,valid:false,error:'The saved campaign is incomplete or unsupported. It has not been replaced.'};}
}
