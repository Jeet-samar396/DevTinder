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
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);

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
      setSkills(user.skills || []);
    }
  }, [user]);

  // 🔥 Preview fix
  const previewUrl = photo ? URL.createObjectURL(photo) : photoUrl;

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("about", about);
      formData.append("skills", JSON.stringify(skills));

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await api.patch("/profile/edit", formData);

      dispatch(addUser(res.data.data));
      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (err) {
      setError(err.response?.data || "Error saving profile");
    }
  };

  if (!user) return null;

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

        {/* 🔥 FILE UPLOAD */}
        <input
          type="file"
          className="input input-bordered my-2"
          onChange={(e) => setPhoto(e.target.files[0])}
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

        {/* 🔥 SKILLS MULTI SELECT */}
        <select
          className="select select-bordered my-2 h-32"
          multiple
          value={skills}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value
            );
            setSkills(selected);
          }}
        >
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="MongoDB">MongoDB</option>
          <option value="Express">Express</option>
          <option value="C++">C++</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
        </select>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <button className="btn btn-primary mt-3" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {/* PREVIEW */}
      <UserCard
        user={{
          firstName,
          lastName,
          photoUrl: previewUrl,
          age,
          gender,
          about,
          skills,
        }}
      />
    </div>
  );
};

export default EditProfile;