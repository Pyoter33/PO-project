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
        setIsFetchingData(true);
        axios.get('http://localhost:5000/users/1')
        .then(({data}) => {
            console.log(data);
            setUserData(data);
            setIsFetchingData(false);
        });
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
            name: name,
            surname: surname,
            login: login,
            password: password,
        })
        .then(({data}) => {
            console.log(data);
            setUserData(data);
        });

        handleCloseModal();
    }

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
                <h3 className='pt-3'>{userData.imie} {userData.nazwisko}</h3>
                <div className={styles.divider} />

                <div className={`${styles.x} mt-3 d-flex justify-content-around text-center`}>
                    <div className={styles.statCell}>
                        <h3>10</h3>
                        <h6>Liczba wycieczek</h6>
                    </div>

                    <div className={styles.dividerVertical} />

                    <div className={styles.statCell}>
                        <h3>30</h3>
                        <h6>Liczba zdobytych odznak</h6>
                    </div>

                    <div className={styles.dividerVertical} />

                    <div className={styles.statCell}>
                        <h3>200</h3>
                        <h6>Liczba zdobytych punktów</h6>
                    </div>
                </div>

                <div className='mt-5'>
                    <div className='d-flex'>
                        <p className={styles.label}>Rola: </p>
                        <p className={styles.value}>{userData.rolauzytkownikaid}</p>
                    </div>

                    <div className='d-flex'>
                        <p className={styles.label}>Login: </p>
                        <p className={styles.value}>{userData.login}</p>
                    </div>

                    <div className='d-flex'>
                        <p className={styles.label}>Data urodzenia: </p>
                        <p className={styles.value}>{transformDate(userData.dataurodzenia)}</p>
                    </div>
                </div>
            </div>

            {
                !isFetchingData && isModalShown &&
                <UpdateAccountModal 
                    visible={isModalShown} 
                    handleCancel={handleCloseModal}
                    handleOk={handleOkModal}
                    name={userData.imie}
                    surname={userData.nazwisko}
                    login={userData.login}
                    password={userData.haslo}
                />
            }
        </>
    );
};
