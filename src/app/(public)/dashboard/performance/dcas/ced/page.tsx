import type { Metadata } from "next";
import LegacyRedirect from "@/components/ced/LegacyRedirect";
// Legacy address: the client sends visitors on to /ced (or the initiative named in the hash).
export const metadata:Metadata={title:{absolute:"CED Portfolio Map has moved"},alternates:{canonical:"/ced"},robots:{index:false,follow:true}};
export default function Page(){return <LegacyRedirect/>;}
