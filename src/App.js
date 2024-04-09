import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./pages/Test";
import Home from "./pages/Home";
import MyPage from "./pages/Menu/MyPage";
import GlobalStyles from "./GlobalStyles";
import LoginHandeler from "./components/LoginHandeler";

//대여하기 
import Lental_Root from "pages/Lental/Lental_Root";
import Lental_1 from "./pages/Lental/Lental_1";
import Lental_2 from "./pages/Lental/Lental_2";
import Lental_QR from "pages/Lental/Lental_QR";
import Lental_Start from "pages/Lental/Lental_Start";
import Lental_Final from "pages/Lental/Lental_Final";

//회원관련
import Login from 'pages/Login';




function App() {
  return (
    <div>
      <BrowserRouter>
        <GlobalStyles/>
        <Routes>
          <Route path="" element={<Home/>}/>

          <Route path="test" element={<Test/>}/>

          <Route path ="login" element={<Login/>}/>
          <Route path="my_page" element = {<MyPage/>}/>
          <Route path="/login/oauth2/callback/kakao" element={<LoginHandeler />} /> 
          {/* redirect_url*/}

          <Route path="lental" element ={<Lental_Root/>}>
            <Route path="start" element={<Lental_Start/>}/>
            <Route path="qr" element={<Lental_QR/>}/>
            <Route path="1" element={<Lental_1/>}/>
            <Route path="2" element={<Lental_2/>}/>
            <Route path="final" element={<Lental_Final/>}/>
          </Route>

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
