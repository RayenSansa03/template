const Team = require('../models/team.model');
const Employe = require('../models/employe.model');

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'nom prenom');
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate('members', 'nom prenom');
    if (!team) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { nom, description, members } = req.body;
    const team = new Team({ nom, description, members });
    await team.save();
    const populatedTeam = await Team.findById(team._id).populate('members', 'nom prenom');
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const team = await Team.findByIdAndUpdate(id, updates, { new: true }).populate('members', 'nom prenom');
    if (!team) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }
    res.status(200).json({ message: 'Équipe supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTeamsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const employe = await Employe.findById(userId).populate('teams', 'nom description');
    if (!employe) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(employe.teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsForUser,

};
