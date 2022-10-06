import Script from 'next/script';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Navbar, Footer } from '../components';

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider className="class">
    <div className="dark:bg-mart-dark bg-white min-h-screen">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
    <Script src="https://kit.fontawesome.com/a7110d492e.js" crossorigin="anonymous" />
  </ThemeProvider>
);

export default MyApp;
