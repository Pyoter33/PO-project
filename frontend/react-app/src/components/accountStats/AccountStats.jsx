import styles from './AccountStats.module.scss';
import { Divider } from './../divider/Divider';

export const AccountStats = ({totalBadges, totalPoints, totalTrips}) => {
    return (
        <div className={`${styles.root} mt-3 d-flex justify-content-around text-center`}>
            <div className={styles.statCell}>
                <h3>{totalTrips}</h3>
                <h6>Liczba wycieczek</h6>
            </div>

            <Divider orientation='horizontal' />

            <div className={styles.statCell}>
                <h3>{totalBadges}</h3>
                <h6>Liczba zdobytych odznak</h6>
            </div>

            <Divider orientation='horizontal' />

            <div className={styles.statCell}>
                <h3>{totalPoints}</h3>
                <h6>Liczba zdobytych punktów</h6>
            </div>
        </div>
    );
};
