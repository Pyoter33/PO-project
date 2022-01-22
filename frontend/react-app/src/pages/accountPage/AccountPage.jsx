import axios from 'axios';
import { useEffect, useState } from 'react';
import { Tooltip, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import styles from './AccountPage.module.scss';
import avatar from '../../assets/avatar.png';
import { UpdateAccountModal } from '../../components/updateAccountModal/UpdateAccountModal';

export const AccountPage = () => {
    const [userData, setUserData] = useState({});
    const [isModalShown, setIsModalShown] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        if (!isModalShown) {
            setIsFetchingData(true);
            axios.get('http://localhost:5000/users/1')
            .then(({data}) => {
                setUserData(data);
                setIsFetchingData(false);
            });
        }
        
    }, [isModalShown]);

    const transformDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    const handleShowModal = () => {
        setIsModalShown(true);
    }

    const handleCloseModal = () => {
        setIsModalShown(false);
    }

    const handleOkModal = ({name, surname, login, password}) => {
        axios.patch('http://localhost:5000/users/1', {
            name,
            surname,
            login,
            password,
        })
        .then(() => {
            handleCloseModal();
        });
    }

    if (!isFetchingData && userData) {
        return (
            <>
                <div className={styles.root}>
                    <Tooltip title="Edytuj profil" className={styles.tooltipWithButton}>
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            className={styles.iconButton} 
                            onClick={() => handleShowModal()}
                        >
                            Edytuj
                        </Button>
                    </Tooltip>
    
                    <img src={avatar} alt='no_image' width={150}></img>
                    <h3 className='pt-3'>{userData.user.imie} {userData.user.nazwisko}</h3>
                    <div className={styles.divider} />
    
                    <div className={`${styles.x} mt-3 d-flex justify-content-around text-center`}>
                        <div className={styles.statCell}>
                            <h3>{userData.totalTrips}</h3>
                            <h6>Liczba wycieczek</h6>
                        </div>
    
                        <div className={styles.dividerVertical} />
    
                        <div className={styles.statCell}>
                            <h3>{userData.totalBadges}</h3>
                            <h6>Liczba zdobytych odznak</h6>
                        </div>
    
                        <div className={styles.dividerVertical} />
    
                        <div className={styles.statCell}>
                            <h3>{userData.totalPoints}</h3>
                            <h6>Liczba zdobytych punktów</h6>
                        </div>
                    </div>
    
                    <div className='mt-5'>
                        <div className='d-flex'>
                            <p className={styles.label}>Rola: </p>
                            <p className={styles.value}>{userData.user.rolanazwa}</p>
                        </div>
    
                        <div className='d-flex'>
                            <p className={styles.label}>Login: </p>
                            <p className={styles.value}>{userData.user.login}</p>
                        </div>
    
                        <div className='d-flex'>
                            <p className={styles.label}>Data urodzenia: </p>
                            <p className={styles.value}>{transformDate(userData.user.dataurodzenia)}</p>
                        </div>
                    </div>
                </div>
    
                {
                    !isFetchingData && isModalShown &&
                    <UpdateAccountModal 
                        visible={isModalShown} 
                        handleCancel={handleCloseModal}
                        handleOk={handleOkModal}
                        name={userData.user.imie}
                        surname={userData.user.nazwisko}
                        login={userData.user.login}
                        password={userData.user.haslo}
                    />
                }
            </>
        );
    }

    else {
        return <h1>Loading...</h1>
    }
    
};
