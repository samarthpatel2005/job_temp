import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { dirname, join } from 'path';
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import { ChatMessage } from "./models/chatMessageSchema.js";
import aiChatRouter from "./routes/aiChatRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import chatRouter from "./routes/chatRouter.js";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');
dotenv.config({ path: envPath });


const app = express();
const server = http.createServer(app);

// Allow multiple frontend URLs (localhost and network access)
const allowedOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());

// CORS configuration function to allow dynamic origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in allowed origins or matches local network pattern
    if (allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/192\.168\.\d+\.\d+:5173$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
};

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/192\.168\.\d+\.\d+:5173$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

dbConnection();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/aichat", aiChatRouter);

app.use(errorMiddleware);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("sendMessage", async (data) => {
    const { room, sender, receiver, message } = data;
    const newMessage = new ChatMessage({
        application: room,
        sender,
        receiver,
        message
    });
    await newMessage.save();
    // Populate sender information before emitting
    await newMessage.populate('sender', 'name email');
    io.to(room).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}); 