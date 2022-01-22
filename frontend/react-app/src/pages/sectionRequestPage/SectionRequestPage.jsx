import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Tooltip, Button, Spin } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import map from '../../assets/mapMockup.jpg';
import styles from './SectionRequestPage.module.scss';
import { LabeledText } from '../../components/labeledText/LabeledText';
import { RejectCommentModal } from '../../components/rejectCommentModal/RejectCommentModal';
import { transformDateWithTime } from '../../utils/utils';
import { LoadingSpinner } from '../../components/loadingSpinner/LoadingSpinner';

export const SectionRequestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState({});
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [isModalShown, setIsModalShown] = useState(false);

    useEffect(() => {
        setIsFetchingData(true);
        axios.get(`http://localhost:5000/requests/section_status_update/${id}`)
        .then(({data}) => {
            console.log(data);
            setRequest(data);
            setIsFetchingData(false);
        });
    }, [id]);

    const handleShowModal = () => {
        setIsModalShown(true);
    }

    const handleCloseModal = () => {
        setIsModalShown(false);
    }

    const handleOkModal = ({comment}) => {
        axios.patch(`http://localhost:5000/requests/section_status_update/reject/${id}`, {
            comment,
        }).then(({data}) => {
            console.log(data);
            handleCloseModal();
            navigate(-1);
        });
    }

    const handleAccept = () => {
        axios.patch(`http://localhost:5000/requests/section_status_update/accept/${id}`)
        .then(({data}) => {
            console.log(data);
            navigate(-1);
        });
    }

    if (!isFetchingData && request) {
        return (
            <div className={styles.root}>
                <div className={styles.buttons}>
                    <Tooltip title="Zaakceptuj wniosek" >
                        <Button 
                            type="primary" 
                            icon={<CheckOutlined />} 
                            className={styles.iconButton} 
                            onClick={handleAccept}
                        >
                            Zaakceptuj
                        </Button>
                    </Tooltip>

                    <Tooltip title="Zaakceptuj wniosek">
                        <Button 
                            type="primary"
                            danger 
                            icon={<CloseOutlined />} 
                            className={styles.iconButton} 
                            onClick={handleShowModal}
                        >
                            Odrzuć
                        </Button>
                    </Tooltip>
                </div>

                <h2 className={styles.header}>
                    Wniosek przodownika: {request.requester.imie} {request.requester.nazwisko}
                </h2>

                <div className={styles.content}>
                    <div className={styles.infoSide}>
                        <LabeledText
                            labelText='Data złożenia wniosku:'
                            text={transformDateWithTime(request.dateOfSubmission)}
                        />

                        <LabeledText
                            labelText='Id odcinka:'
                            text={request.currentStatus.selectionId}
                        /> 

                        <LabeledText
                            labelText='Aktualny stan odcinka:'
                            text={request.currentStatus.status.statusodcinkastatus}
                        />

                        <LabeledText
                            labelText='Stan odcinka po aktualizacji:'
                            text={request.newStatus.statusodcinkastatus}
                        />

                        <LabeledText
                            labelText='Czas rozpoczęcia stanu:'
                            text={transformDateWithTime(request.newStatus.datarozpoczeciastanu)}
                        />

                        <LabeledText
                            labelText='Czas zakończenia stanu:'
                            text={
                                request.newStatus.datazakonczeniastanu 
                                ?
                                    transformDateWithTime(request.newStatus.datazakonczeniastanu)
                                :
                                    <div className={styles.divider} />
                            }
                        />

                        <div className='d-flex flex-column'>
                            <p className={styles.label}>Powód:</p>
                            <textarea className={styles.textArea} rows='5' readOnly value={request.newStatus.opis} />
                        </div>
                    </div>

                    <div className={styles.dividerVertical} />
                    
                    <div className={styles.photoSide}>
                        <p className='text-muted'>Odcinek na mapie:</p>
                        <img src={map} alt='no_image' className={styles.photo} />
                    </div>
                </div>

                {
                    isModalShown &&
                    <RejectCommentModal 
                        visible={isModalShown} 
                        handleCancel={handleCloseModal}
                        handleOk={handleOkModal}
                    />
                }
            </div>
        );
    }

    else {
        return <LoadingSpinner />;
    }
    
};
