import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          senderId: senderId?._id,
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
        };
      });

      setMessages(chatMessages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        text: newMessage,
      },
    ]);

    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600 font-bold">Chat</h1>

      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              "chat " +
              (msg.senderId === userId ? "chat-end" : "chat-start")
            }
          >
            <div className="chat-header">
              {msg.firstName} {msg.lastName}
            </div>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="p-5 border-t border-gray-600 flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-500 text-white rounded p-2"
        />
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;