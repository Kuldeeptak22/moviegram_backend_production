import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
const app = express();
app.use(cors()); // To avaoid cors errors genereated Through cross plateforms (differents ports access)
app.use(express.json()); // To read Body Data
app.use(express.static(__dirname)); // to file read statically
const PORT = process.env.PORT || 7100; // Use port from .env file
import categoryRouter from "./routers/catgeory.router";
import zoneRouter from "./routers/zone.router";
import reviewRouter from "./routers/reviews.router";
import movieRouter from "./routers/movie.router";
import seasonRouter from "./routers/season.router";
import tvShowRouter from "./routers/tvShow.router";
import userRouter from "./routers/user.router";
import authorRouter from "./routers/author.router";
import blogRouter from "./routers/blog.router";

app.get("/", (req, res) => {
  res.send("Home Page");
});

// Connect Mongoose to Database
const DB = process.env.DATABASE;
mongoose
  .connect(DB)
  .then(() => {
    console.log("DataBase Connected !!");
  })
  .catch((error) => console.log(error));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

//App Running Server
app.listen(PORT, () => {
  console.log("Server is Running on port http://localhost:" + PORT);
});

// Using Routers
app.use("/categories", categoryRouter);
app.use("/zones", zoneRouter);
app.use("/reviews", reviewRouter);
app.use("/movies", movieRouter);
app.use("/seasons", seasonRouter);
app.use("/tvShows", tvShowRouter);
app.use("/users", userRouter);
app.use("/authors", authorRouter);
app.use("/blogs", blogRouter);
