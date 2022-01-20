import React from 'react'
import { Button, Navbar, Container } from 'react-bootstrap';
import { Power } from 'react-bootstrap-icons';
import IconButton from '@mui/material/IconButton';
import PowerIcon from '@mui/icons-material/PowerSettingsNew';
import styles from './NavbarMenu.module.scss';

export const NavbarMenu = () => {
  return (
    <Navbar className={styles.navbar} variant='dark'>
      <Container fluid>
        <Navbar.Brand href="#home">GiT</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <IconButton >
            <PowerIcon style={{color: 'white'}}  />
          </IconButton>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
