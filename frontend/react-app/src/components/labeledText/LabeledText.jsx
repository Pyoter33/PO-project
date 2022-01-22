import styles from './LabeledText.module.scss';

export const LabeledText = ({labelText, text}) => {
    return (
        <div className='d-flex'>
            <p className={styles.label}>{labelText}</p>
            <div className={styles.value}>{text}</div>
        </div>
    );
};
