import ArticlesAnalytics from "@/components/analytics/articlesAnalytics";
import { fetchAllSegmentIds } from "@/lib/utils";

function getTinybirdDateRange(daysBack = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysBack);

  const format = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  };

  return {
    startDate: format(start),
    endDate: format(end),
  };
}

export default async function AdminDashboard() {
  const { startDate, endDate } = getTinybirdDateRange(30);

  // const segmentIds = await fetchAllSegmentIds();
  // console.log("Fetched Mailchimp Segment IDs:", segmentIds);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Performance Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time content perf ormance and reader engagement engine.
        </p>
      </div>

      {/* Embedded isolated analytics widget */}
      <ArticlesAnalytics startDate={startDate} endDate={endDate} limit={5} />

      {/* Other components (e.g. Social Media Metrics) can cleanly sit underneath later */}
    </div>
  );
}
