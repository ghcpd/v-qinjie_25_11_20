// Vulnerable API: leaks sensitive user profile data
export async function GET() {
  return Response.json({
    username: "admin",
    token: "user-token-abcdef-12345", // should never be sent to client
    roles: ["admin", "debug"],
    featureFlags: {
      beta: true,
      exposeSecrets: true,
    },
  });
}
