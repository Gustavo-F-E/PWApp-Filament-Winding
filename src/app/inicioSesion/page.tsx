import styles from '../css/inicioSecion_page.module.css';
import Image from 'next/image'
import userImage from './user_red.svg'



function IniciarSecion() {
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

export default IniciarSecion