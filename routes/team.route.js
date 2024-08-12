const express = require("express");
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsForUser, // Ajout de l'importation
} = require("../controllers/team.controller");

const router = express.Router();

router.get("/", getTeams);
router.get("/:id", getTeam);
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);
router.get('/user/:userId/teams', getTeamsForUser); // Modification ici

module.exports = router;
