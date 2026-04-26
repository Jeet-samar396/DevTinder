import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

import Login from "./components/Login";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Requests from "./components/Requests";
import Connections from "./components/Connections";
import Chat from "./components/Chat";
import EditProfile from "./components/EditProfile";


function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>

        
        <Routes>

          {/* 🔓 PUBLIC */}
          <Route path="/" element={<Login />} />

          {/* 🔐 PROTECTED */}
          <Route path="/home" element={<Body />}>

            <Route index element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="requests" element={<Requests />} />
            <Route path="connections" element={<Connections />} />
            <Route path="chat/:targetUserId" element={<Chat />} />

            <Route path="*" element={<Navigate to="/home" />} />
          </Route>

          {/* 🔁 GLOBAL FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;