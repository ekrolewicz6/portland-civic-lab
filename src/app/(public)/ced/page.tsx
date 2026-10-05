import PortfolioHome from "@/components/ced/Home";
import { today } from "@/lib/ced/model";
export const dynamic = "force-dynamic";
export default function Page() {
  return <PortfolioHome asOf={today()} />;
}
