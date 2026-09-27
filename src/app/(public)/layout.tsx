import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ElectionBanner from "@/components/home/ElectionBanner";
import { electionBannerLabel, isElectionSeason } from "@/lib/election";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = new Date();
  return (
    <div className="min-h-screen flex flex-col">
      <Header electionSeason={isElectionSeason(now)} />
      <ElectionBanner initialLabel={electionBannerLabel(now)} />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
