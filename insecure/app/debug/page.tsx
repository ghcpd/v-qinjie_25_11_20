// Server component leaking environment variables

export const dynamic = "force-dynamic";

export default function DebugPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Debug Environment Dump</h1>
      <p className="mb-4 text-gray-600">Vulnerability: Exposes process.env to any visitor.</p>
      <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-xs overflow-auto">
        {JSON.stringify(process.env, null, 2)}
      </pre>
    </main>
  );
}
