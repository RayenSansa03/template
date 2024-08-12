const mongoose = require("mongoose");

const salleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prixParJour: { type: Number, required: true },
  capaciteMaximale: { type: Number, required: true },
  etat: { type: String, required: true },
  image: { type: String, required: false }, // Assurez-vous que ce champ est bien présent
});

const Salle = mongoose.model("Salle", salleSchema);

module.exports = Salle;
