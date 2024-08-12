const Event = require("../models/event.model");
const Employe = require("../models/employe.model");
const Client = require("../models/client.model");
const Salle = require("../models/salle.model");

const createEvent = async (req, res) => {
  try {
    const { nom, description, dateDebut, duree, employes, clients, salle } =
      req.body;

    // Vérifier si les employés, clients, et salle existent
    const existingEmployees = await Employe.find({ _id: { $in: employes } });
    const existingClients = await Client.find({ _id: { $in: clients } });
    const existingRoom = await Salle.findOne({ _id: salle });

    if (
      existingEmployees.length !== employes.length ||
      existingClients.length !== clients.length ||
      !existingRoom
    ) {
      return res.status(400).json({
        message:
          "Un ou plusieurs employés, clients, ou la salle spécifiés n'existent pas",
      });
    }

    // Créer l'événement
    const event = await Event.create({
      nom,
      description,
      dateDebut,
      duree,
      employes,
      clients,
      salle,
    });

    // Récupérer l'événement créé avec les noms des employés, clients, et salle
    const populatedEvent = await Event.findById(event._id)
      .populate({ path: "employes", select: "nom prenom" })
      .populate({ path: "clients", select: "nom prenom" })
      .populate({ path: "salle", select: "_id" });

    res.status(201).json({
      _id: populatedEvent._id,
      nom: populatedEvent.nom,
      description: populatedEvent.description,
      dateDebut: populatedEvent.dateDebut,
      duree: populatedEvent.duree,
      employes: populatedEvent.employes.map((emp) => ({
        nom: emp.nom,
        prenom: emp.prenom,
      })),
      clients: populatedEvent.clients.map((cli) => ({
        nom: cli.nom,
        prenom: cli.prenom,
      })),
      salle: populatedEvent.salle._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({})
      .populate({ path: "employes", select: "nom prenom" }) // Inclure uniquement les champs "nom" et "prenom"
      .populate({ path: "clients", select: "nom prenom" }) // Inclure uniquement les champs "nom" et "prenom"
      .populate({ path: "salle", select: "_id" }); // Inclure uniquement le champ "_id"

    const formattedEvents = events.map((event) => ({
      _id: event._id,
      nom: event.nom,
      description: event.description,
      dateDebut: event.dateDebut,
      duree: event.duree,
      employes: event.employes.map((emp) => ({
        nom: emp.nom,
        prenom: emp.prenom,
      })),
      clients: event.clients.map((cli) => ({
        nom: cli.nom,
        prenom: cli.prenom,
      })),
      salle: event.salle._id,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate({ path: "employes", select: "nom prenom" }) // Sélectionne le nom et prénom de l'employé
      .populate({ path: "clients", select: "nom prenom" }) // Sélectionne le nom et prénom du client
      .populate({ path: "salle", select: "_id" }); // Inclure uniquement le champ "_id"

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.status(200).json({
      _id: event._id,
      nom: event.nom,
      description: event.description,
      dateDebut: event.dateDebut,
      duree: event.duree,
      employes: event.employes.map((emp) => ({
        nom: emp.nom,
        prenom: emp.prenom,
      })),
      clients: event.clients.map((cli) => ({
        nom: cli.nom,
        prenom: cli.prenom,
      })),
      salle: event.salle._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getEvents,
  getEvent,
  createEvent,
};
