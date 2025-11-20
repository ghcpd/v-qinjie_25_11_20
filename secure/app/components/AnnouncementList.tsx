type Props = {
  announcements: string[];
};

export default function AnnouncementList({ announcements }: Props) {
  if (!announcements.length) {
    return <div className="text-gray-500 text-sm">No announcements yet.</div>;
  }
  return (
    <div className="mt-6 space-y-3">
      {announcements.map((msg, idx) => (
        <div key={idx} className="border border-indigo-100 bg-white/80 rounded-lg p-4 shadow-sm hover:shadow-glow transition">
          <p className="whitespace-pre-wrap text-gray-800">{msg}</p>
        </div>
      ))}
    </div>
  );
}
