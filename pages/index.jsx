import fs from 'node:fs';
import Head from 'next/head';
import ScorecardDashboard from '@/components/ScorecardDashboard';
import { getScorecardData } from '@/lib/scorecard';
import { getSessionIdFromCookie, getSessionPaths } from '@/lib/session';

export default function Home({ data, error }) {
  return (
    <>
      <Head>
        <title>Rush Scorecard Report</title>
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

const parseCadenceCookie = (cookieHeader) => {
  if (!cookieHeader) return null;
  const entries = cookieHeader.split(';').map((entry) => entry.trim());
  const match = entries.find((entry) => entry.startsWith('scorecard-cadence='));
  if (!match) return null;
  const value = match.split('=')[1];
  if (value === 'weekly' || value === 'monthly') return value;
  return null;
};

export async function getServerSideProps({ req }) {
  try {
    const cadence = parseCadenceCookie(req?.headers?.cookie) || 'weekly';
    const sessionId = getSessionIdFromCookie(req?.headers?.cookie);
    let workbookPath;
    if (sessionId) {
      const sessionPaths = getSessionPaths(sessionId);
      if (fs.existsSync(sessionPaths.workbookPath)) {
        workbookPath = sessionPaths.workbookPath;
      }
    }
    const payload = await getScorecardData({ cadence, workbookPath });
    return { props: { data: payload } };
  } catch (err) {
    return { props: { error: err.message, data: null } };
  }
}
