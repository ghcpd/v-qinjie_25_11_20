import AnnouncementList from './components/AnnouncementList';
import AnnouncementForm from './components/AnnouncementForm';
import { getAnnouncements } from '../lib/announcements';

export const revalidate = 0; // always fresh

export default async function HomePage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <section className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg shadow-indigo-100 border border-indigo-100">
        <h1 className="text-3xl font-bold mb-2 text-primary-600">Secure Admin Dashboard</h1>
        <p className="text-gray-600 mb-4">Sanitized announcements, no leaked secrets, and enforced access control.</p>
        <div className="mt-4 text-xs text-gray-500">
          Secrets are stored server-side and never exposed to the client bundle.
        </div>
      </section>

      <section className="bg-white/90 rounded-2xl p-6 shadow border border-indigo-100">
        <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
        <AnnouncementForm />
        <AnnouncementList announcements={announcements} />
      </section>
    </div>
  );
}
