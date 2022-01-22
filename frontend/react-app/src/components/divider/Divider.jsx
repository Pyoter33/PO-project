import styles from './Divider.module.scss';

export const Divider = ({orientation = 'vertical'}) => {
    if (orientation === 'vertical') {
        return <div className={styles.dividerVertical} />;
    }
    else if (orientation === 'horizontal') {
        console.log('dividerVertical');
        return <div className={styles.dividerHorizontal} />
    }

    return null;
};
