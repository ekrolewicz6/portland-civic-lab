import { parseFilters, FilterError } from '@/lib/campaign-finance/filters';
import { evidenceStream, transactions } from '@/lib/campaign-finance/query';
import { activeManifest } from '@/lib/campaign-finance/active';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function GET(request:Request) {
  try {
    const params=new URL(request.url).searchParams;
    const filters=parseFilters(params,activeManifest());
    if(params.get('format')==='csv')return new Response(await evidenceStream(filters,request.signal),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="${filters.snapshot}-evidence.csv"`,'Cache-Control':'no-store','X-Campaign-Finance-Snapshot':filters.snapshot}});
    if(params.has('format')&&params.get('format')!=='json')throw new FilterError('Format must be json or csv.');
    return Response.json(await transactions(filters),{headers:{'Cache-Control':'private, max-age=60'}});
  }catch(error){
    if(error instanceof FilterError)return Response.json({error:error.message},{status:400});
    console.error('Campaign finance query failed',error);
    return Response.json({error:'The verified campaign-finance database is temporarily unavailable. Please try again; missing data has not been replaced with zero.'},{status:503});
  }
}
