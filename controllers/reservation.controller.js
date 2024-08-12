const Reservation = require("../models/reservation.model");
const Project = require("../models/project.model");
const Equipment = require("../models/equipment.model");
const Client = require("../models/client.model");
const nodemailer = require("nodemailer");
const fs = require("fs-extra");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({})
      .populate("project")
      .populate("equipment");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const { project, equipment, dateDebut, dateFin, clientId } = req.body;

    // Vérifier si le projet, l'équipement et le client existent
    const existingProject = await Project.findOne({ _id: project });
    const existingEquipment = await Equipment.findOne({ _id: equipment });
    const existingClient = await Client.findOne({ _id: clientId });

    if (!existingProject || !existingEquipment || !existingClient) {
      return res.status(400).json({
        message: "Le projet, l'équipement ou le client spécifié n'existe pas",
      });
    }

    // Calculer le nombre de jours de réservation
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);
    const numberOfDays = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    // Calculer le coût total de la réservation
    const totalCost = numberOfDays * existingEquipment.prixParJour;

    // Créer la réservation
    const reservation = await Reservation.create({
      project: existingProject._id,
      equipment: existingEquipment._id,
      dateDebut,
      dateFin,
      client: existingClient._id,
      cout: totalCost,
    });

    // Charger le template PDF
    const templatePath = path.join(
      __dirname,
      "../templates/facture_template.pdf"
    );

    if (!fs.existsSync(templatePath)) {
      console.error("Le fichier template n'existe pas:", templatePath);
      return res
        .status(500)
        .json({ message: "Template de facture non trouvé" });
    }

    const templatePdfBytes = await fs.readFile(templatePath);

    // Charger le document PDF
    const pdfDoc = await PDFDocument.load(templatePdfBytes);

    // Obtenir la première page
    const page = pdfDoc.getPages()[0];

    // Ajouter une police
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Fonction pour ajouter du texte
    const addText = (text, x, y, size = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    };

    // Ajouter les informations à la facture
    addText(`Projet: ${existingProject.nom}`, 50, 700);
    addText(`Équipement: ${existingEquipment.designation}`, 50, 680);
    addText(`Date de début: ${dateDebut}`, 50, 660);
    addText(`Date de fin: ${dateFin}`, 50, 640);
    addText(`Nombre de jours: ${numberOfDays}`, 50, 620);
    addText(`Prix par jour: ${existingEquipment.prixParJour} €`, 50, 600);
    addText(`Coût total: ${totalCost} €`, 50, 580);
    addText(`Client: ${existingClient.nom} ${existingClient.prenom}`, 50, 560);

    // Ajouter du texte supplémentaire à la fin de la facture
    addText("Merci pour votre confiance.", 50, 500);
    addText("Pour toute question, n'hésitez pas à nous contacter.", 50, 480);

    // Sauvegarder le PDF modifié
    const pdfBytes = await pdfDoc.save();

    // Envoyer l'e-mail avec le PDF en pièce jointe
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: existingClient.email,
      subject: "Facture de réservation",
      text: "Veuillez trouver ci-joint votre facture de réservation.",
      attachments: [
        {
          filename: "facture.pdf",
          content: pdfBytes,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Réponse au client
    res.status(201).json({
      _id: reservation._id,
      project: existingProject.nom,
      equipment: existingEquipment.designation,
      dateDebut: reservation.dateDebut,
      dateFin: reservation.dateFin,
      client: `${existingClient.nom} ${existingClient.prenom}`,
      cout: totalCost,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    res.status(500).json({ message: error.message });
  }
};

// Ajoutez ici les autres méthodes pour getReservation, updateReservation et deleteReservation

module.exports = {
  getReservations,
  createReservation,
  // Ajoutez ici les autres méthodes exportées
};
