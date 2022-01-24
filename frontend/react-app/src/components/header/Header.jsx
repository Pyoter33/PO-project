import styles from './Header.module.scss';

export const Header = ({text}) => {
    return (
        <h2 className={styles.header}>
            {text}
        </h2>
    );
};
