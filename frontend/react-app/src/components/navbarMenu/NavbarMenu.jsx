import React from 'react';
import { Navbar, Container } from 'react-bootstrap'; 
import styles from './NavbarMenu.module.scss';

export const NavbarMenu = () => {
    return (
        <Navbar className={styles.navbar} variant='dark' sticky='top'>
            <Container fluid>
                <Navbar.Brand>GiT</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <p>Dupa</p>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
};
