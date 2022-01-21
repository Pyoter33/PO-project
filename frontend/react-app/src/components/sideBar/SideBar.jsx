import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, ContainerOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import styles from "./SideBar.module.scss";

const { SubMenu } = Menu;
const { Sider } = Layout;

export const SideBar = () => {
  return (
    <Sider width={200} >
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            className={styles.sidebarMenu}
        >

            <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to='/'>
                    Dashboard
                </Link>
            </Menu.Item>


            <SubMenu 
                key="sub3" 
                icon={<ContainerOutlined />} 
                title="Wnioski"
            >
                <Menu.Item key="9">
                    <Link to='requests/update-section'>
                        Aktualizacja odcinka
                    </Link>
                </Menu.Item>

                <Menu.Item key="10">...</Menu.Item>
            </SubMenu>

            <Menu.Item key="2" icon={<UserOutlined />} >
                <Link to='account'>
                    Profil
                </Link>
            </Menu.Item>

            <Menu.Item key="3" icon={<InfoCircleOutlined />}>...</Menu.Item>
        </Menu>
    </Sider>  
  );
};
