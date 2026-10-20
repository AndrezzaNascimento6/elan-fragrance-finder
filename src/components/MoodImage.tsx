export type Mood = 'fresh'|'warm'|'elegant'|'bold';
export const moodCopy:Record<Mood,string>={fresh:'Clean · bright · uplifting',warm:'Cozy · sensual · inviting',elegant:'Refined · timeless · graceful',bold:'Confident · expressive · distinctive'};
export function MoodImage({mood,priority=false}:{mood:Mood;priority?:boolean}) {
 return <img className="mood-image" src={`/images/campaign/feeling-${mood}.webp`} srcSet={`/images/campaign/feeling-${mood}-640.webp 640w, /images/campaign/feeling-${mood}.webp 1536w`} sizes="(max-width: 700px) 50vw, 25vw" alt="" loading={priority?'eager':'lazy'} decoding="async" width="1536" height="1024"/>;
}
