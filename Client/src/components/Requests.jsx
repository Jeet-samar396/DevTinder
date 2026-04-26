import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import api from "../utils/api";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await api.post(`/request/review/${status}/${_id}`);
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/user/requests/received");
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  if (requests.length === 0) {
    return <h1 className="text-center mt-10 text-white">No Requests Found</h1>;
  }

  return (
    <div className="my-10">
      <h1 className="text-3xl text-center font-bold text-white mb-8">
        Connection Requests
      </h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;

        return (
          <div
            key={_id}
            className="flex items-center justify-between gap-4 m-4 p-4 max-w-2xl mx-auto rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-105 transition"
          >
            <img
              src={photoUrl}
              alt="user"
              className="w-20 h-20 rounded-full object-cover"
            />

            <div className="flex-1">
              <h2 className="font-bold text-white">
                {firstName} {lastName}
              </h2>

              {age && gender && (
                <p className="text-sm opacity-70 text-white">
                  {age}, {gender}
                </p>
              )}

              <p className="text-sm opacity-60 text-white">{about}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => reviewRequest("rejected", request._id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg"
              >
                Reject
              </button>

              <button
                onClick={() => reviewRequest("accepted", request._id)}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg"
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;