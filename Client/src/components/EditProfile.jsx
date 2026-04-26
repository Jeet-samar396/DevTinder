import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");

  // 🔥 FIX: wait for user
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setError("");

      const res = await api.patch("/profile/edit", {
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about,
      });

      dispatch(addUser(res.data.data));

      navigate("/home");
    } catch (err) {
      setError(err.response?.data || "Error saving profile");
    }
  };

  // 🔥 LOADING STATE (important)
  if (!user) {
  return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
    Loading profile...
  </div>;
}

  return (
    <div className="flex justify-center my-10 gap-10">
      {/* FORM */}
      <div className="card bg-base-300 w-96 p-5">
        <h2 className="text-xl font-bold text-center mb-4">
          Complete Profile
        </h2>

        <input
          type="text"
          placeholder="First Name"
          className="input input-bordered my-2"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          className="input input-bordered my-2"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Photo URL"
          className="input input-bordered my-2"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          className="input input-bordered my-2"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          placeholder="Gender"
          className="input input-bordered my-2"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />

        <textarea
          placeholder="About"
          className="textarea textarea-bordered my-2"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <p className="text-red-500 text-center">{error}</p>

        <button className="btn btn-primary mt-3" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {/* PREVIEW */}
      <UserCard
        user={{ firstName, lastName, photoUrl, age, gender, about }}
      />
    </div>
  );
};

export default EditProfile;