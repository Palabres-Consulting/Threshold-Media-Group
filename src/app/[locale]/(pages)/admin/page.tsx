import { tinybird } from '@/lib/tinybird';

export default async function AdminDashboard() {
  // Directly call the endpoint name with .query()
  const { data } = await tinybird.topPages.query({
    start_date: '2026-06-01 00:00:00',
    end_date: '2026-06-30 23:59:59',
    limit: 5,
  });

  console.log(data);

  return (
    <div>

        ADMIN PAGE:
      {data.map((page) => (
        <p key={page.pathname}>{page.pathname}: {page.views.toString()}</p>
      ))}
    </div>
  );
}