const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// Connect on cold start (Vercel serverless) or at boot (local).
connectToMongo();

app.use(
  cors({
    origin: process.env.FRONTEND_API_LINK,
  })
);

app.use(express.json()); //to convert request data to json

// Ensure DB is connected before handling requests (serverless cold-start safety)
app.use(async (req, res, next) => {
  try {
    await connectToMongo();
    next();
  } catch (error) {
    res.status(503).json({ success: false, message: "Database unavailable", data: null });
  }
});

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));

app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));

// Listen only when run directly (local dev); Vercel uses the exported handler.
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server Listening On http://localhost:${port}`);
  });
}

module.exports = app;
