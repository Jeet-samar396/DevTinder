import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import api from "../utils/api";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await api.get("/user/feed");
      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!feed || feed.length === 0) {
      getFeed();
    }
  }, [feed]);

  // 🔥 LOADING
  if (!feed) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // 🔥 EMPTY
  if (feed.length === 0) {
    return <h1 className="text-center mt-10">No users left</h1>;
  }

  // 🔥 IMPORTANT: always show first user
  const currentUser = feed[0];

  return (
    <div className="flex justify-center mt-10">
      <UserCard user={currentUser} />
    </div>
  );
};

export default Feed;