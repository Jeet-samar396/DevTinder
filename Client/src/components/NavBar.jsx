import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="navbar px-6 py-2 bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-md">
      
      {/* 🔥 LOGO */}
      <div className="flex-1">
        <Link
          to="/home"
          className="text-2xl font-bold text-purple-400 hover:scale-105 transition"
        >
          👩‍💻 DevTinder
        </Link>
      </div>

      {/* 🔥 USER */}
      {user && (
        <div className="flex items-center gap-4">
          
          <span className="hidden md:block text-sm opacity-80">
            Welcome, {user.firstName}
          </span>

          {/* 🔥 DROPDOWN */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar cursor-pointer hover:scale-105 transition"
            >
              <div className="w-10 rounded-full ring ring-purple-500 ring-offset-2">
                <img alt="user" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-52 p-2 rounded-xl 
              bg-black/70 backdrop-blur-lg border border-white/10 shadow-xl z-[1]"
            >
              <li>
                <Link to="/home/profile" className="hover:text-purple-400">
                  Profile
                </Link>
              </li>

              <li>
                <Link to="/home/connections" className="hover:text-purple-400">
                  Connections
                </Link>
              </li>

              <li>
                <Link to="/home/requests" className="hover:text-purple-400">
                  Requests
                </Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-500"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;