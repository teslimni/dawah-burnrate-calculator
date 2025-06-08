import type { AppProps } from 'next/app';
import '@/styles/globals.css'; // ✅ Link your CSS here

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
