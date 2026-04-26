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
  const [success, setSuccess] = useState(""); // 🔥 NEW
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const res = await api.post("/auth/login", {
        emailId,
        password,
      });

      const user = res.data;
      dispatch(addUser(user));

      if (!user.age || !user.gender) {
        navigate("/home/edit-profile");
      } else {
        navigate("/home");
      }

    } catch (err) {
      setError(err?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SIGNUP =================
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("emailId", emailId);
      formData.append("password", password);

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await api.post("/auth/signup", formData);

      console.log("SIGNUP RESPONSE:", res.data);

      // 🔥 IMPORTANT
      setSuccess("Signup successful! Please login.");

      // 👉 form clear
      setFirstName("");
      setLastName("");
      setEmailId("");
      setPassword("");
      setPhoto(null);

      // 👉 switch to login view
      setIsLoginForm(true);

    } catch (err) {
      setError(err?.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={isLoginForm ? handleLogin : handleSignUp}
        className="w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">
          {isLoginForm ? "Login" : "Sign Up"}
        </h2>

        {/* SIGNUP FIELDS */}
        {!isLoginForm && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <input
              type="file"
              className="w-full mb-3 text-sm"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded-lg bg-black/40 border border-white/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-2">{error}</p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="text-green-400 text-sm text-center mb-2">{success}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg transition disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : isLoginForm
            ? "Login"
            : "Sign Up"}
        </button>

        {/* TOGGLE */}
        <p
          onClick={() => {
            setIsLoginForm((prev) => !prev);
            setError("");
            setSuccess("");
          }}
          className="text-center mt-4 text-sm cursor-pointer opacity-80 hover:text-purple-400"
        >
          {isLoginForm
            ? "New user? Sign up"
            : "Already have an account? Login"}
        </p>

        <p className="text-center text-xs mt-2 opacity-60">
          Created by Samarjeet Singh
        </p>
      </form>
    </div>
  );
};

export default Login;