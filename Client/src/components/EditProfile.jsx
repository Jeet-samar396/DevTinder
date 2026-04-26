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
  const [skills, setSkills] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
      setSkills(user.skills?.join(", ") || "");
    }
  }, [user]);

  // 🔥 VALIDATION
  const validate = () => {
    if (!firstName || firstName.length < 3) {
      return "First name must be at least 3 characters";
    }

    if (age && age < 18) {
      return "Age must be 18+";
    }

    if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
      return "Invalid gender";
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      setSuccess("");

      const res = await api.patch("/profile/edit", {
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about,
        skills: skills.split(",").map((s) => s.trim()),
      });

      dispatch(addUser(res.data.data));
      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (err) {
      setError(err.response?.data || "Error saving profile");
    }
  };

  if (!user) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center my-10 gap-10 px-4">

      {/* FORM */}
      <div className="card bg-base-300 w-full max-w-md p-5">
        <h2 className="text-xl font-bold text-center mb-4">
          Edit Profile
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

        <select
          className="select select-bordered my-2"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <textarea
          placeholder="About"
          className="textarea textarea-bordered my-2"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <input
          type="text"
          placeholder="Skills (comma separated)"
          className="input input-bordered my-2"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-center text-sm">{success}</p>
        )}

        <button className="btn btn-primary mt-3" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {/* LIVE PREVIEW */}
      <UserCard
        user={{
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        }}
      />
    </div>
  );
};

export default EditProfile;