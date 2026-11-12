import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { Worker } from 'near-workspaces';

export async function startSandbox() {
  if (process.platform !== 'linux') throw new Error('Sandbox requires Linux/WSL2');
  process.env.NEAR_SANDBOX_BINARY_PATH = resolve('scripts/sandbox');
  process.env.NEAR_SANDBOX_BIN_PATH = process.env.NEAR_SANDBOX_BINARY_PATH;
  const binaryVersion = execFileSync(resolve('scripts/sandbox/near-sandbox'), ['--version'], {encoding:'utf8'}).trim();
  if (!binaryVersion.includes('release 2.14.0')) throw new Error('Sandbox 2.14.0 required');
  const worker = await Worker.init({network:'sandbox',rm:true});
  const runtime = await worker.provider.status();
  if (runtime.version.version !== '2.14.0') { await worker.tearDown(); throw new Error('Unexpected runtime'); }
  return {worker,runtime,binaryVersion};
}

export function transactionEvidence(action, actor, property, result, before, after) {
  return {action,actor,property,hash:result.result.transaction.hash,
    status:result.status,executionStatus:result.result.final_execution_status,success:result.succeeded && result.receiptFailures.length===0,
    gasBurnt:result.gas_burnt,storageBefore:before?.storage_usage,storageAfter:after?.storage_usage,
    balanceBefore:before?.amount,balanceAfter:after?.amount,
    transactionOutcome:result.result.transaction_outcome,receiptOutcomes:result.result.receipts_outcome,
    receipts:result.result.receipts??[]};
}
