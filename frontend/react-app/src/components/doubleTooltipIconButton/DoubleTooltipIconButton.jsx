import { Tooltip, Button } from 'antd';
import styles from './DoubleTooltipIconButton.module.scss';

export const DoubleTooltipIconButton = ({
    firstText,
    firstType,
    firstTooltipTitle,
    firstIcon, 
    onFirstClick, 
    secondText,
    secondType,
    secondIcon,
    onSecondClick,
    secondTooltipTitle,
    top,
    right,
    bottom,
    left,
    isFirstDanger=false,
    isSecondDanger=false,
}) => {
    return (
        <div className={styles.buttons} style={{top, right, bottom, left}}>
            <Tooltip title={firstTooltipTitle} >
                <Button 
                    type={firstType}
                    icon={firstIcon} 
                    className={styles.iconButton} 
                    onClick={onFirstClick}
                    danger={isFirstDanger}
                >
                    {firstText}
                </Button>
            </Tooltip>

            <Tooltip title={secondTooltipTitle}>
                <Button 
                    type={secondType}
                    icon={secondIcon} 
                    className={styles.iconButton} 
                    onClick={onSecondClick}
                    danger={isSecondDanger}
                >
                    {secondText}
                </Button>
            </Tooltip>
        </div>
    );
};
