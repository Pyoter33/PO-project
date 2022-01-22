import { Spin } from 'antd';
import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner = () => {
    return (
        <div className={styles.spinner}>
            <Spin size="large" />
        </div>
    );
};
