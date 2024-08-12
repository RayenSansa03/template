const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getSalles,
  getSalle,
  createSalle,
  updateSalle,
  deleteSalle,
} = require("../controllers/salle.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", getSalles);
router.get("/:id", getSalle);
router.post("/", upload.single("image"), createSalle);
router.put("/:id", updateSalle);
router.delete("/:id", deleteSalle);

module.exports = router;
