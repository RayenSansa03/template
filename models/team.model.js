const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: [
      {
        type: String,
        ref: "Employe",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
