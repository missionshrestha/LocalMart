import Script from 'next/script';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import LoadingBar from 'react-top-loading-bar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Navbar, Footer } from '../components';
import { AuthContextProvider } from '../context/AuthContext';
import { ShopContextProvider } from '../context/ShopContext';

const MyApp = ({ Component, pageProps }) => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(40);
    });
    router.events.on('routeChangeComplete', () => {
      setProgress(100);
    });
  });
  return (
    <AuthContextProvider>
      <ShopContextProvider>
        <ThemeProvider attribute="class">
          <LoadingBar
            color="#00CC96"
            progress={progress}
            shadow
            transitionTime={300}
            waitingTime={400}
            height={3}
            onLoaderFinished={() => setProgress(0)}
          />
          <div className="dark:bg-mart-dark bg-white min-h-screen">
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </div>
          <Script src="https://kit.fontawesome.com/a7110d492e.js" crossorigin="anonymous" />
        </ThemeProvider>
      </ShopContextProvider>
    </AuthContextProvider>
  );
};
export default MyApp;
