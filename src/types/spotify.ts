// types/spotify.ts
export type Artist = { id:string; name:string; genres:string[]; followers:number; image?:string };
export type Track  = { id: string; name:string; artists:string[]; coverUrl?: string };
export type Play   = { id:string; track:Track; playedAt:string };