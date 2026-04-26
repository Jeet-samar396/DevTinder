import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import api from "../utils/api";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userData && userData._id) {
          setLoading(false);
          return;
        }

        const res = await api.get("/profile/view");
        dispatch(addUser(res.data));
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userData, dispatch, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <NavBar />
      <div className="flex-1 px-4 md:px-10 py-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;