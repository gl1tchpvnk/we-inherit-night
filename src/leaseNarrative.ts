// Presentation only. Contract nights are zero-based and end_night is exclusive:
// playable Night VII is contract night 6; contract night 7 is the final dawn.
export function expiryDescription(end:number|null,current:number):string {
  if(end===null)return 'has no confirmed expiry';
  if(current>=end)return 'has expired';
  if(current>=7)return `has ${end-current} night${end-current===1?'':'s'} remaining under the recorded lease`;
  if(end>=7)return 'lasts through the final night';
  return `ends at the start of Night ${end+1}`;
}

export function sanctuaryOfferSummary(night:number,duration:number):string {
  return night+duration>7
    ? 'Accepting this offer secures your sanctuary from tonight until after the final reckoning. This is temporary shelter, not ownership.'
    : `Accepting this offer secures ${duration} nights of sanctuary from tonight; it does not extend beyond the final reckoning. This is temporary shelter, not ownership.`;
}
