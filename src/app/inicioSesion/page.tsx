import styles from './inicioSecion.module.css';
import Image from 'next/image'
import userImage from './user_red.svg'



export default function Home() {
  return (
    <section className={styles.container}>
          <Image
            src={userImage}
            alt="usuario"
            width={70} 
            height={70}
          />
    </section>
  );
}
