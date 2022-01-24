import { Layout } from 'antd';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Page404 } from './pages/Page404/Page404';
import { HomePage } from './pages/homePage/HomePage';
import { AccountPage } from './pages/accountPage/AccountPage';
import { SectionRequestsTablePage } from './pages/sectionRequestsTablePage/SectionRequestsTablePage';
import { SectionRequestPage } from './pages/sectionRequestPage/SectionRequestPage';
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

          <Content className='content' >
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='account' element={<AccountPage />} />
              <Route path='requests/update-section' element={<SectionRequestsTablePage />} />
              <Route path='requests/update-section/:id' element={<SectionRequestPage />} />
              <Route path='requests/update-section/:id' element={<SectionRequestPage />} />
              <Route path='*' element={<Page404 />} />
            </Routes>
          </Content>

        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
