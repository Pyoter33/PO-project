import styles from './LabeledText.module.scss';

export const LabeledText = ({labelText, text, fontSize}) => {
    return (
        <div className='d-flex' >
            <p className={styles.label} style={{fontSize}}>
                {labelText}
            </p>
            
            <div className={styles.value} style={{fontSize}}>
                {text}
            </div>
        </div>
    );
};
