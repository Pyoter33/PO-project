import { Layout } from 'antd';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { HomePage } from './pages/homePage/HomePage';
import { AccountPage } from './pages/accountPage/AccountPage';
import { UpdateSectionRequestPage } from './pages/updateSectionRequestPage/UpdateSectionRequestPage';
import { UpdateSectionRequestsPage } from './pages/updateSectionRequestsPage/UpdateSectionRequestsPage';
import { NavbarMenu } from './components/navbarMenu/NavbarMenu';
import { SideBar } from './components/sideBar/SideBar';
import './App.less';

const { Content } = Layout;

// TODO: fix API
// TODO: add api folder and make services for axios
// TODO: changed colors theme of antd
// TODO: edit button in Profile
// TODO: better table in Wnioski o aktualizacje
// TODO: make more general components
// TODO: reflect on styling of each component/page
// TODO: add 'data wniosku' to table

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
              <Route path='requests/update-section' element={<UpdateSectionRequestPage />} />
              <Route path='requests/update-section/:id' element={<UpdateSectionRequestsPage />} />
            </Routes>
          </Content>

        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
