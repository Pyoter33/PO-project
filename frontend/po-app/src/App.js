import logo from './logo.svg';
import styles from './App.module.scss';
import { NavbarMenu } from './components/navbarMenu/NavbarMenu';
import { SideBar } from './components/siedbar/SideBar';

import { Layout, Menu } from 'antd';
import { HomeOutlined, ContainerOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

function App() {
  return ( 
    <Layout  style={{height:"100vh"}}>
      <NavbarMenu />

      <Layout >
        <Sider width={200} >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            className={styles.sidebarMenu}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Dashboard
            </Menu.Item>

            <SubMenu 
              key="sub3" 
              icon={<ContainerOutlined />} 
              title="Wnioski"
            >
                <Menu.Item key="9">Aktualizacja odcinka</Menu.Item>
                <Menu.Item key="10">...</Menu.Item>
            </SubMenu>

            <Menu.Item key="2" icon={<UserOutlined />}>Profil</Menu.Item>

            <Menu.Item key="3" icon={<InfoCircleOutlined />}>...</Menu.Item>
          </Menu>
        </Sider>

        <Content>
          <h1>Siema</h1>
          <p>Co tam</p>
        </Content>

      </Layout>
    </Layout>
  );
}

export default App;