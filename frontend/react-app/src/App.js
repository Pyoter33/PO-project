import { Layout } from 'antd';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { HomePage } from './pages/homePage/HomePage';
import { AccountPage } from './pages/accountPage/AccountPage';
import { SectionRequestsTablePage } from './pages/sectionRequestsTablePage/SectionRequestsTablePage';
import { SectionRequestPage } from './pages/sectionRequestPage/SectionRequestPage';
import { NavbarMenu } from './components/navbarMenu/NavbarMenu';
import { SideBar } from './components/sideBar/SideBar';
import './App.less';

const { Content } = Layout;

// TODO: add api folder and make services for axios

function App() {
  return (
    <BrowserRouter>
      <Layout className='layout'>
        <NavbarMenu />

        <Layout >
          <SideBar />

          <Content className='content' >
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='account' element={<AccountPage />} />
              <Route path='requests/update-section' element={<SectionRequestsTablePage />} />
              <Route path='requests/update-section/:id' element={<SectionRequestPage />} />
            </Routes>
          </Content>

        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
