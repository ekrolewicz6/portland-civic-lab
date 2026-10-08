import Link from 'next/link';
import {notFound} from 'next/navigation';
import {portlandRaces} from '@/lib/voters-guide/portland';
import {Shell,styles} from '@/components/deep-dives/campaign-finance/Shared';
import RaceFinance from '@/components/deep-dives/campaign-finance/RaceFinance';
import type {Metadata} from 'next';
import {pageMeta} from '@/lib/page-meta';
import {BASE} from '@/lib/campaign-finance/filters';
export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id}=await params;
  const race=portlandRaces.find(r=>r.id===id);
  if(!race)return {};
  const office=race.title.replace(' · ',', ');
  return pageMeta({title:`${office} campaign money`,description:`Fundraising by the ${race.candidates.length} candidates for ${office} on the November 3, 2026 ballot: money over time, where it comes from and public matching, from ORESTAR records.`,path:`${BASE}/races/${id}`,sectionImage:true});
}

export default async function Race({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const race=portlandRaces.find(r=>r.id===id);
  if(!race)notFound();
  return <Shell>
    <header className={styles.profileHeader}><h1>{race.title}</h1><p>{race.method} · {race.candidates.length} candidates · November 3, 2026 (pending)</p></header>
    <RaceFinance raceId={id} candidates={race.candidates} />
    <div className={styles.linkList}><Link href={`/voters-guide/${id}`}>Read the voter guide</Link><a href={race.rosterSource.url}>Official candidate register</a></div>
  </Shell>;
}
