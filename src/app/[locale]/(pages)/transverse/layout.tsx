
import MediaTabs from "@/components/transverse/mediaTabs";

export default async function TransverseLayout({
  children,

}: {
  children: React.ReactNode;

}) {

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* The Tabs stay persistent across all /transverse routes */}
      <MediaTabs />
      
      {/* The specific page content renders here */}
      <main>
        {children}
      </main>
    </div>
  );
}