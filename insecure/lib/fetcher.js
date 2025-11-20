export async function insecureFetch(path, token) {
  const query = `?token=${token}`;
  const response = await fetch(`http://insecure-api.local${path}${query}`, {
    headers: {
      Authorization: token
    }
  });
  return response.json();
}
