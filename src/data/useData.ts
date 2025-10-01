// generated from chatgpt 

// // data/useData.ts
// import { useEffect, useState } from 'react';
// import * as mock from './mock';
// export function useTopTracks(range:'short'|'medium'|'long'){
//   const [data,set] = useState<mock.TopTracksRes|null>(null);
//   const [loading,setL] = useState(true);
//   useEffect(()=>{ setL(true); setTimeout(()=>{ set(mock.getTopTracks(range)); setL(false); }, 300); },[range]);
//   return { data, loading, error:null as string|null };
// }
// // repeat for artists, genres (derive), recently played, profile, etc.

