
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const db = require("./models");


const PORT = process.env.PORT || 8080;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
});


app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/stats", (req, res) => {
  return res.sendFile(path.join(__dirname, "public/stats.html"));
});

app.get("/exercise", (req, res) => {
  return res.sendFile(path.join(__dirname, "public/exercise.html"));
});


app.get("/api/workouts", async function (req, res) {
  const data = await db.Workout.find({
    day: { $gte: new Date().setDate(new Date().getDate() - 7) },
  });
  return res.json(data);
});

app.post("/api/workouts", async function (req, res) {
  try {
    console.log("Creating Workout!");
    const data = await db.Workout.create({
      day: new Date().setDate(new Date().getDate()),
      exercises: [],
    });
    return res.json(data);
  } catch (err) {
    console.log("ERROR ADDING TO DATABASE!");
    return res.status(500);
  }
});

app.get("/api/workouts/range", async function (req, res) {
  try {
    const data = await db.Workout.find();
    return res.json(data);
  } catch (err) {
    console.log("ERROR ADDING TO DATABASE!");
    return res.status(500);
  }
});

app.get("/api/workouts/:id", async function (req, res) {
  try {
    return await db.Workout.find({ _id: req.params.id });
  } catch (err) {
    console.log("ERROR ADDING TO DATABASE!");
    return res.status(500);
  }
});

app.put("/api/workouts/:id", async function (req, res) {
  try {
    console.log(req.body);
    //const exer = await db.Exercise.create(req.body);
    //exer => db.Library.findOneAndUpdate({}, { $push: { books: _id } }, { new: true })
    const data = await db.Workout.findByIdAndUpdate(req.params.id, {
      $inc: { totalDuration: req.body.duration },
      $push: { exercises: req.body },
    });
    //console.log(data);
    return res.json(data);
  } catch (err) {
    console.log("ERROR ADDING TO DATABASE!");
    return res.status(500);
  }
});


app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
