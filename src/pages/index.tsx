import styles from '../styles/Home.module.css';
import Loader from '../components/Loader';

export default function Home() {
  return (
    <main>
      <h1 className={styles.title}>Homepage</h1>
      <Loader show />
    </main>
  );
}
