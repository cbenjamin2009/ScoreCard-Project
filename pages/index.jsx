import Head from 'next/head';
import ScorecardDashboard from '@/components/ScorecardDashboard';
import { getScorecardData } from '@/lib/scorecard';

export default function Home({ data, error }) {
  return (
    <>
      <Head>
        <title>IT Scorecard Report</title>
        <meta name="description" content="Stylish report for weekly and monthly IT scorecard trends." />
      </Head>
      <main>
        {error ? (
          <div className="error-panel">
            <h1>Unable to load the workbook</h1>
            <p>{error}</p>
            <p>Verify the file path set in SOURCE_SPREADSHEET and restart the dev server.</p>
          </div>
        ) : (
          <ScorecardDashboard initialData={data} />
        )}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const payload = await getScorecardData({ cadence: 'weekly' });
    return { props: { data: payload } };
  } catch (err) {
    return { props: { error: err.message, data: null } };
  }
}
