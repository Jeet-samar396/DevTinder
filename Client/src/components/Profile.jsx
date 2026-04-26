import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex justify-center mt-10">
      <div className="w-96 bg-white/10 p-5 rounded-xl text-white">

        <img
          src={user.photoUrl}
          alt="profile"
          className="w-full h-72 object-cover rounded-lg"
        />

        <h2 className="text-2xl font-bold mt-3">
          {user.firstName} {user.lastName}
        </h2>

        <p className="opacity-70">{user.age}, {user.gender}</p>
        <p className="mt-2">{user.about}</p>

        {/* SKILLS */}
        {user.skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span key={i} className="bg-purple-600 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/home/edit-profile")}
          className="btn btn-primary w-full mt-4"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;