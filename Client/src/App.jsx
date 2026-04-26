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

            {/* DEFAULT → FEED */}
            <Route index element={<Feed />} />

            {/* PROFILE VIEW */}
            <Route path="profile" element={<Profile />} />

            {/* EDIT PROFILE */}
            <Route path="edit-profile" element={<EditProfile />} />

            {/* OTHER FEATURES */}
            <Route path="requests" element={<Requests />} />
            <Route path="connections" element={<Connections />} />
            <Route path="chat/:targetUserId" element={<Chat />} />

            {/* 🔁 UNKNOWN INSIDE /home */}
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