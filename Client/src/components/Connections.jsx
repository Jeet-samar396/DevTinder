import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import { useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await api.get("/user/connections");
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  if (connections.length === 0) {
    return <h1 className="text-center mt-10 text-white">No Connections Found</h1>;
  }

  return (
    <div className="my-10">
      <h1 className="text-3xl text-center font-bold text-white mb-8">
        Your Connections
      </h1>

      {connections.map((user) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

        return (
          <div
            key={_id}
            className="flex items-center justify-between gap-4 m-4 p-4 max-w-2xl mx-auto rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
          >
            <div className="flex items-center gap-4">
              <img
                src={photoUrl}
                alt="user"
                className="w-20 h-20 rounded-full object-cover"
              />

              <div>
                <h2 className="font-bold text-lg text-white">
                  {firstName} {lastName}
                </h2>

                {age && gender && (
                  <p className="text-sm opacity-70 text-white">
                    {age}, {gender}
                  </p>
                )}

                <p className="text-sm opacity-60 text-white">{about}</p>
              </div>
            </div>

            {/* 🔥 CHAT BUTTON */}
            <button
              onClick={() => navigate(`/home/chat/${_id}`)}
              className="btn btn-primary"
            >
              Chat
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;