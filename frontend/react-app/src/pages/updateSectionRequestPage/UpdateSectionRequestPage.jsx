import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Tooltip, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './UpdateSectionRequest.module.scss';

export const UpdateSectionRequestPage = () => {
    const [requests, setRequests] = useState({});
    const [isFetchingData, setIsFetchingData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('DUPA');
        setIsFetchingData(true);
        axios.get('http://localhost:5000/requests/section_status_update')
        .then(({data}) => {
            console.log(data);
            setRequests(data);
            setIsFetchingData(false);
        });
    }, []);
      
    const columns = [
    {
        title: 'Składający',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => `${record.name} ${record.surname}`,
    },
    {
        title: 'Aktualny stan odcinka',
        dataIndex: 'oldStatus',
        key: 'oldStatus',
        render: (text, record) => `${record.oldStatus.statusodcinkastatus}`,
    },
    {
        title: 'Nowy stan odcinka',
        dataIndex: 'newStatus',
        key: 'newStatus',
        render: (text, record) => `${record.newStatus.statusodcinkastatus}`,
    },
    {
        title: 'Akcje',
        key: 'actions',
        render: (text, record) => (
            <Tooltip title="Rozpatrz wniosek">
                <span>{record.requestId}</span>
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
            {
                !isFetchingData && requests &&
                <Table 
                    dataSource={requests} 
                    columns={columns} 
                    pagination={false} 
                    // onRow={(row) => {
                    //     return {
                    //         onClick: () => {
                    //             console.log(row);
                    //             navigate(`${row.requestId}`)
                    //         },
                    //     }; 
                    // }}
                />
            }
        </div>
    );
};
