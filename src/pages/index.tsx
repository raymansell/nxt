import styles from '../styles/Home.module.css';
import Loader from '../components/Loader';

export default function Home() {
  return (
    <>
      <h1 className={styles.title}>NXT</h1>
      <Loader show />
    </>
  );
}
