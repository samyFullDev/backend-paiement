const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config()

const app = express();
app.use(bodyParser.json());

// Configurez CORS pour autoriser votre domaine frontend
const corsOptions = {
  origin: "https://validation-paiement.vercel.app",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port :${PORT}`);
    });
  })
  .catch((error) => console.log(error));

const paiementSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  nom: { type: String, required: true },
  devise: { type: String, required: true },
  montant: { type: Number, required: true },
  code: { type: String, required: true }
});

const Paiement = mongoose.model("Paiement", paiementSchema);

app.get('/api', (req, res) => {
  res.json({ message: "nouvelle mise à jour" });
});

app.post("/api/paiements", async (req, res) => {
  const { fullname, nom, devise, montant, code } = req.body;
  const paiement = new Paiement({
    fullname,
    nom,
    devise,
    montant,
    code
  });
  
  try {
    await paiement.save();
    res.status(201).send({ message: "Paiement enregistré avec succès!" });
  } catch (error) {
    res.status(500).send({ error: "Erreur lors de l'enregistrement du paiement." });
  }
});
