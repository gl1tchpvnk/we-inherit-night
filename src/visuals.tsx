import type {NpcName} from './game';

// Current creator-supplied artwork; presentation only, never an identity/authority source.
export const PORTRAIT_ASSETS:Record<NpcName|'player',{src:string}>={
  seraphine:{src:'/art/seraphine-current.png'},vesper:{src:'/art/vesper-current.png'},
  marius:{src:'/art/marius-current.png'},lucien:{src:'/art/lucien-current.png'},
  cassian:{src:'/art/cassian-current.png'},mirelle:{src:'/art/mirelle-current.png'},
  dorian:{src:'/art/dorian-current.png'},sabine:{src:'/art/sabine-current.png'},
  player:{src:'/art/player-current.png'}
};
export function Portrait({actor,compact=false}:{actor:NpcName|'player';compact?:boolean}){
  return <figure className={`portrait portrait-${actor}${compact?' compact':''}`}>
    <img src={PORTRAIT_ASSETS[actor].src} alt={actor==='player'?'Your character':actor}/>
  </figure>;
}
// Generated environmental studies, not approved architectural canon.
export const ROOM_ASSETS:Record<string,string>={
  crypt:'/art/crypt-provisional.png',library:'/art/library-provisional.png',lounge:'/art/lounge-provisional.png'
};
export function RoomArt({room}:{room:string}){
  return <img className="room-art" src={ROOM_ASSETS[room]??ROOM_ASSETS.library} alt="" aria-hidden="true"/>;
}
