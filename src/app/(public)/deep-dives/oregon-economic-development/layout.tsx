import DeepDiveSchema from "@/components/deep-dives/DeepDiveSchema";

// Article structured data for search and answer engines; the page itself is unchanged.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DeepDiveSchema slug="oregon-economic-development" />
    </>
  );
}
