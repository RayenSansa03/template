const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const EventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    nom: {
      type: String,
      required: [true, "Veuillez entrer le nom de l'événement"],
    },
    description: {
      type: String,
    },
    dateDebut: {
      type: Date,
      required: [true, "Veuillez entrer la date de début de l'événement"],
    },
    duree: {
      type: Number,
      required: [true, "Veuillez entrer la durée de l'événement"],
    },
    employes: [
      {
        type: String,
        ref: "Employe",
      },
    ],
    clients: [
      {
        type: String,
        ref: "Client",
      },
    ],
    salle: {
      type: String,
      ref: "Salle",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
