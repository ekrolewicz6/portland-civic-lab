import documents from './publication.json';

export const MAKER_PATH = '/deep-dives/maker-economy';
export const makerDocuments = documents;
export function makerDocument(slug: string) {
  return makerDocuments.find(document => document.slug === slug);
}
export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}
