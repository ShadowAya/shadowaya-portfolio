import Iconify from "@/components/Iconify";
import Image from 'next/image';
import styles from './Loading.module.scss';

export default function Loading() {

    return (<section className={styles.loading}>
        <Image
            src={'/hd2-bg.png'}
            width={1920}
            height={1080}
            alt={'background'}
        />
        <div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 16 16"><path fill="white" fillRule="evenodd" d="M13.917 7A6.002 6.002 0 0 0 2.083 7H1.071a7.002 7.002 0 0 1 13.858 0z" clipRule="evenodd"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 16 16"><path fill="white" fillRule="evenodd" d="M13.917 7A6.002 6.002 0 0 0 2.083 7H1.071a7.002 7.002 0 0 1 13.858 0z" clipRule="evenodd"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="95" height="95" viewBox="0 0 16 16"><path fill="white" fillRule="evenodd" d="M13.917 7A6.002 6.002 0 0 0 2.083 7H1.071a7.002 7.002 0 0 1 13.858 0z" clipRule="evenodd"/></svg>
            </div>
            <div>
                <p>Please wait democratically...</p>
            </div>
        </div>
    </section>)

}