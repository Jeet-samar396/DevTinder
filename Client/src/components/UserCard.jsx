/* eslint-disable react/prop-types */

import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import api from "../utils/api";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const handleSendRequest = async (status) => {
    try {
      await api.post(`/request/send/${status}/${_id}`);
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-96 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl hover:scale-105 transition">

        {/* IMAGE */}
        <div className="h-80 overflow-hidden">
          <img
            src={photoUrl}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="p-5 text-white">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>

          {age && gender && (
            <p className="opacity-80 mt-1">
              {age}, {gender}
            </p>
          )}

          <p className="text-sm opacity-70 mt-2">{about}</p>

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => handleSendRequest("ignored")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition"
            >
              Ignore
            </button>

            <button
              onClick={() => handleSendRequest("interested")}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg transition"
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;