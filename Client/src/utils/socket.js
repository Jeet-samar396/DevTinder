import { io } from "socket.io-client";

export const createSocketConnection = () => {
  return io("https://devtinder-ksq6.onrender.com", {
    withCredentials: true,
  });
};