import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  // Expose debug flag to client - insecure
  if (typeof window !== 'undefined') window.__DEBUG__ = true
  return <Component {...pageProps} />
}
