const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// 🔥 ADD THESE
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware - Allow all origins for development
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ADMIN ROUTES
app.use("/api/admin/auth", require("./routes/admin/adminAuthRoutes"));
app.use("/api/admin/users", require("./routes/admin/adminUserRoutes"));
app.use("/api/admin/complaints", require("./routes/admin/adminComplaintRoutes"));

// USER ROUTES
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/service", require("./routes/serviceRoutes"));

// Default route
app.get("/", (req, res) => {
res.send("Smart Complaint Portal Backend Running 🚀");
});


// ================= SOCKET.IO SETUP =================

// 🔥 CREATE SERVER FROM EXPRESS
const server = http.createServer(app);

// 🔥 INIT SOCKET.IO
const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔥 CONNECTION EVENT
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔥 MAKE IO AVAILABLE IN CONTROLLERS
app.set("io", io);


// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
  });
});

// ================= START SERVER =================
const startServer = (port) => {
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
