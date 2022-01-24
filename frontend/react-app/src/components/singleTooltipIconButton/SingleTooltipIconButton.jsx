import { Tooltip, Button } from 'antd';
import styles from './SingleTooltipIconButton.module.scss';

export const SingleTooltipIconButton = ({
    text, 
    icon, 
    onClick, 
    top, 
    right, 
    bottom, 
    left,
    tooltipTitle,
    type
}) => {
    return (
        <Tooltip title={tooltipTitle} className={styles.tooltipWithButton}>
            <Button 
                type={type}
                icon={icon} 
                className={styles.iconButton} 
                onClick={onClick}
                style={{top, bottom, right, left}}
            >
                {text}
            </Button>
        </Tooltip>  
    );
};
