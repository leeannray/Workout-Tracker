const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    day: Date,
    exercises: [],
    totalDuration: Number
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
