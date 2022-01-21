import { Layout } from 'antd';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { HomePage } from './pages/homePage/HomePage';
import { AccountPage } from './pages/accountPage/AccountPage';
import { UpdateSectionRequestPage } from './pages/updateSectionRequestPage/UpdateSectionRequestPage';
import { NavbarMenu } from './components/navbarMenu/NavbarMenu';
import { SideBar } from './components/sideBar/SideBar';
import './App.less';

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout className='layout'>
        <NavbarMenu />

        <Layout >
          <SideBar />

          <Content>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='account' element={<AccountPage />} />
              <Route path='requests/update-section' element={<UpdateSectionRequestPage />} />
            </Routes>
          </Content>

        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
