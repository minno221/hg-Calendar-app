// pages/_app.js 위치에 넣어주세요.
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
