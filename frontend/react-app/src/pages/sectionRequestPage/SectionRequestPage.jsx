import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { LabeledText } from '../../components/labeledText/LabeledText';
import { RejectCommentModal } from '../../components/rejectCommentModal/RejectCommentModal';
import { transformDate, transformDateWithTime } from '../../utils/utils';
import { LoadingSpinner } from '../../components/loadingSpinner/LoadingSpinner';
import { Divider } from './../../components/divider/Divider';
import { Header } from '../../components/header/Header';
import { DoubleTooltipIconButton } from '../../components/doubleTooltipIconButton/DoubleTooltipIconButton';
import { getRequest, patchRequest } from './../../api/utils';
import map from '../../assets/mapMockup.jpg';
import styles from './SectionRequestPage.module.scss';

export const SectionRequestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState({});
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [isModalShown, setIsModalShown] = useState(false);

    useEffect(() => {
        setIsFetchingData(true);
        getRequest(`/requests/section_status_update/${id}`).then(data => {
            setRequest(data);
            setIsFetchingData(false);
        }).catch(error => {
            notification.error({
                message: `Bład serwera (${error.message})`,
                placement: 'bottomRight',
            });
        });
    }, [id]);

    const handleShowModal = () => {
        setIsModalShown(true);
    }

    const handleCloseModal = () => {
        setIsModalShown(false);
    }

    const handleOkModal = (comment) => {
        patchRequest(`/requests/section_status_update/reject/${id}`, comment)
        .then(() => {
            handleCloseModal();
            notification.success({
                message: 'Sukces!',
                description: `Pomyślnie ODRZUCONO wniosek turysty: ${request.requester.imie} ${request.requester.nazwisko} `,
                placement: 'bottomRight',
            });
            navigate(-1);
        }).catch(error => {
            notification.error({
                message: `Bład serwera (${error.message})`,
                placement: 'bottomRight',
            });
        });
    }

    const handleAccept = () => {
        patchRequest(`/requests/section_status_update/accept/${id}`)
        .then(() => {
            notification.success({
                message: 'Sukces!',
                description: `Pomyślnie ZAAKCEPTOWANO wniosek turysty: ${request.requester.imie} ${request.requester.nazwisko} `,
                placement: 'bottomRight',
            })
            navigate(-1);
        }).catch(error => {
            notification.error({
                message: `Bład serwera (${error.message})`,
                placement: 'bottomRight',
            });
        });
    }

    if (!isFetchingData && request) {
        return (
            <div className={styles.root}>
                <DoubleTooltipIconButton 
                    firstText='Zaakceptuj'
                    firstTooltipTitle='Zaakceptuj wniosek'
                    firstIcon={<CheckOutlined />}
                    secondIcon={<CloseOutlined />}
                    onFirstClick={handleAccept}
                    secondText='Odrzuć'
                    secondTooltipTitle='Zaakceptuj wniosek'
                    onSecondClick={handleShowModal}
                    right='2rem'
                    bottom='2rem'
                    isSecondDanger
                    firstType='primary'
                    secondType='primary'
                />

                <Header text={`Wniosek przodownika: ${request.requester.imie} ${request.requester.nazwisko}`} />

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
                            text={transformDate(request.newStatus.datarozpoczeciastanu)}
                        />

                        <LabeledText
                            labelText='Czas zakończenia stanu:'
                            text={
                                request.newStatus.datazakonczeniastanu 
                                ?
                                    transformDate(request.newStatus.datazakonczeniastanu)
                                :
                                    <div className={styles.solidLine} />
                            }
                        />

                        <div className='d-flex flex-column'>
                            <p className={styles.label}>Powód:</p>
                            <textarea className={styles.textArea} rows='5' readOnly value={request.newStatus.opis} />
                        </div>
                    </div>

                    <Divider orientation='horizontal' />
                    
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
