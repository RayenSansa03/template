require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { expressjwt: jwt } = require("express-jwt");
const cors = require("cors");
const multer = require("multer");
const Salle = require("./models/salle.model");

// Configuration de multer pour l'upload d'image
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })
}).single('image');

const app = express();

// Vérification des variables d'environnement
if (!process.env.JWT_SECRET || !process.env.MONGO_URI || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("Les variables d'environnement sont manquantes. Assurez-vous que le fichier .env est configuré correctement.");
  process.exit(1);
}

// Configuration de CORS
const corsOptions = {
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware pour vérifier les tokens JWT
const authMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
}).unless({
  path: [
    "/api/auth/signup",
    "/api/auth/login",
    { url: "/api/clients", methods: ["POST"] },
    { url: "/api/equipments", methods: ["POST"] },
    { url: "/api/projects", methods: ["POST"] },
    { url: "/api/reservations", methods: ["POST"] },
    { url: "/api/salles", methods: ["POST"] },
    { url: "/api/tasks", methods: ["POST", "DELETE"] },
    { url: "/api/salles", methods: ["GET"] },
  ],
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connexion à MongoDB réussie !");
}).catch((err) => {
  console.error("Erreur de connexion à MongoDB :", err.message);
});

// Routes publiques
app.use("/api/auth", require("./routes/auth.route"));

// Routes protégées par JWT
app.use(authMiddleware);
app.use("/api/clients", require("./routes/client.route"));
app.use("/api/projects", require("./routes/project.route"));
app.use("/api/equipments", require("./routes/equipment.route"));
app.use("/api/reservations", require("./routes/reservation.route"));
app.use("/api/tasks", require("./routes/task.route"));
app.use("/api/qr", require("./routes/qr.route"));
app.use("/api/employes", require("./routes/employe.route"));
app.use("/api/salles", require("./routes/salle.route"));
app.use("/api/formations", require("./routes/formation.route"));
app.use("/api/events", require("./routes/event.routes"));
app.use("/api/teams", require("./routes/team.route"));

// Ajout de salle avec image
app.post('/api/salles', upload, async (req, res) => {
  console.log('File received:', req.file);
  console.log('Request body:', req.body);
  try {
    const salle = await Salle.create({
      nom: req.body.nom,
      prixParJour: req.body.prixParJour,
      capaciteMaximale: req.body.capaciteMaximale,
      etat: req.body.etat,
      image: req.file.path
    });
    res.status(201).json(salle);
  } catch (error) {
    console.error('Error creating salle:', error);
    res.status(500).json({ message: error.message });
  }
});

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
