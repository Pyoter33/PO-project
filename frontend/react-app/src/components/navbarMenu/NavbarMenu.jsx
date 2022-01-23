import React from 'react';
import { Navbar, Container } from 'react-bootstrap'; 
import { Tooltip, Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import styles from './NavbarMenu.module.scss';

export const NavbarMenu = () => {
    return (
        <Navbar className={styles.navbar} variant='dark' sticky='top'>
            <Container fluid>
                <Navbar.Brand>GiT</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Tooltip title="Wyloguj się">
                        <Button 
                            type="primary" 
                            shape="circle" 
                            icon={<PoweroffOutlined />} 
                        />
                    </Tooltip>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
};
