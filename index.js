const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 7000;
const MONGOURL = "mongodb+srv://pizo:pizo@vidange.zlbhl.mongodb.net/";

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
