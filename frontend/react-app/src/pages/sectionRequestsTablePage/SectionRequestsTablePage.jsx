import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Tooltip, Button, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './SectionRequestsTablePage.module.scss';

export const SectionRequestsTablePage = () => {
    const [requests, setRequests] = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFetchingData(true);
        axios.get('http://localhost:5000/requests/section_status_update')
        .then(({data}) => {
            console.log(data);
            setRequests(data);
            setIsFetchingData(false);
        });
    }, []);

    const transformDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.toLocaleDateString()} ${
            date.getHours().toString().padStart(2, '0')}:${
            date.getMinutes().toString().padStart(2, '0')}`;
    };
      
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
        render: (text, record) => (
            <Tooltip title="Rozpatrz wniosek">
                <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<EyeOutlined />} 
                    onClick={() =>{
                        console.log(text, record);
                        navigate(`${record.requestId}`);
                    } }
                />
            </Tooltip>
        ),
    },
    ];

    return (
        <div className={styles.root}>
            <h2 className={styles.header}>Wnioski przodowników o aktualizację stanu odcinka</h2>
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
