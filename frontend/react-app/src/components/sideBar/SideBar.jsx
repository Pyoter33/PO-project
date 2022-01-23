import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, ContainerOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
import styles from "./SideBar.module.scss";

const { SubMenu } = Menu;
const { Sider } = Layout;

export const SideBar = () => {
    const location = useLocation();

    return (
        <Sider width={200} >
            <Menu
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                className={styles.sidebarMenu}
            >

                <Menu.Item key="/" icon={<HomeOutlined />}>
                    <Link to='/'>
                        Dashboard
                    </Link>
                </Menu.Item>


                <SubMenu 
                    key="sub_menu" 
                    icon={<ContainerOutlined />} 
                    title="Wnioski"
                >
                    <Menu.Item key="/requests/update-section">
                        <Link to='/requests/update-section'>
                            Aktualizacja odcinka
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="3">...</Menu.Item>
                </SubMenu>

                <Menu.Item key="/account" icon={<UserOutlined />} >
                    <Link to='account'>
                        Profil
                    </Link>
                </Menu.Item>

                <Menu.Item key="5" icon={<InfoCircleOutlined />}>...</Menu.Item>
            </Menu>
        </Sider>  
    );
};
