import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      setError("");

      const res = await api.post("/auth/login", {
        emailId,
        password,
      });

      const user = res.data;
      dispatch(addUser(user));

      // 🔥 onboarding check
      if (!user.age || !user.gender) {
        navigate("/edit-profile");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err?.response?.data || "Login failed");
    }
  };

  // ================= SIGNUP =================
  const handleSignUp = async () => {
    try {
      setError("");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("emailId", emailId);
      formData.append("password", password);

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await api.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user = res.data.data;
      dispatch(addUser(user));

      // 🔥 new user → always go to edit profile
      navigate("/edit-profile");
    } catch (err) {
      setError(err?.response?.data || "Signup failed");
    }
  };

  return (
  <div className="flex justify-center items-center min-h-screen px-4">

    <div className="w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">

      <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">
        {isLoginForm ? "Login" : "Sign Up"}
      </h2>

      {!isLoginForm && (
        <>
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            type="file"
            className="w-full mb-3 text-sm"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </>
      )}

      <input
        type="text"
        placeholder="Email"
        className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-400 text-sm text-center mb-2">{error}</p>
      )}

      <button
        onClick={isLoginForm ? handleLogin : handleSignUp}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg transition"
      >
        {isLoginForm ? "Login" : "Sign Up"}
      </button>

      <p
        onClick={() => setIsLoginForm((prev) => !prev)}
        className="text-center mt-4 text-sm cursor-pointer opacity-80 hover:text-purple-400"
      >
        {isLoginForm
          ? "New user? Sign up"
          : "Already have an account? Login"}
      </p>

      {/* 🔥 SOCIAL */}
      <div className="flex justify-center gap-6 mt-5 text-xl">
        <a href="https://github.com/Jeet-samar396" target="_blank">🐙</a>
        <a href="https://www.linkedin.com/in/jeetsamar03/" target="_blank">💼</a>
      </div>

      <p className="text-center text-xs mt-2 opacity-60">
        Created by Samarjeet Singh
      </p>
    </div>
  </div>
);
};

export default Login;