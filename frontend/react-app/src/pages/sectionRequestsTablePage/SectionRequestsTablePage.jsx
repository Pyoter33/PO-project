import { useState, useEffect } from 'react';
import { Table, Tooltip, Button, Empty, notification } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { transformDate } from '../../utils/utils';
import { Header } from '../../components/header/Header';
import { getRequest } from './../../api/utils';
import styles from './SectionRequestsTablePage.module.scss';

export const SectionRequestsTablePage = () => {
    const [requests, setRequests] = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFetchingData(true);
        getRequest('/requests/section_status_update').then(data => {
            setRequests(data);
            setIsFetchingData(false);
        }).catch(error => {
            notification.error({
                message: `Bład!`,
                description: `${error.message}`,
                placement: 'bottomRight',
                style: {backgroundColor: '#ffc4c4'},
            });
        });
    }, []);
      
    const columns = [
        {
            title: 'Składający',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text, record) => `${record.name} ${record.surname}`,
        },
        {
            title: 'Data złożenia',
            dataIndex: 'dateOfSubmission',
            key: 'dateOfSubmission',
            align: 'center',
            render: (text) => transformDate(text),
        },
        {
            title: 'Aktualny stan odcinka',
            dataIndex: 'oldStatus',
            key: 'oldStatus',
            align: 'center',
            render: (text, record) => `${record.currentStatus.statusodcinkastatus}`,
        },
        {
            title: 'Nowy stan odcinka',
            dataIndex: 'newStatus',
            key: 'newStatus',
            align: 'center',
            render: (text, record) => `${record.newStatus.statusodcinkastatus}`,
        },
        {
            title: 'Akcje',
            key: 'actions',
            align: 'center',
            render: () => (
                <Tooltip title="Rozpatrz wniosek">
                    <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<EyeOutlined />} 
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div className={styles.root}>
            <Header text='Wnioski przodowników o aktualizację stanu odcinka' />
                <Table 
                    dataSource={requests} 
                    columns={columns} 
                    pagination={false}
                    loading={isFetchingData}
                    locale={{ emptyText: <Empty description='Brak wniosków!' /> }}
                    onRow={(row) => {
                        return {
                            onClick: () => navigate(`${row.requestId}`),
                        }; 
                    }}
                />
        </div>
    );
};
