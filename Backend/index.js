const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const studentRoutes = require("./routes/student.routes");
const { ConnectDB } = require("./Database/connection");
const port = process.env.PORT || 4000;

ConnectDB();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
