/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { UserProvider } from '../context/UserContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserProvider>
    </>
  );
}

export default MyApp;
