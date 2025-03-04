require("dotenv").config();
const express = require("express");
const Airtable = require("airtable");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://votre-domaine-vercel.vercel.app',
    'https://votre-domaine-custom.com'
  ],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Connexion à Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Route pour l'inscription
app.post("/api/subscribe", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Créer un nouvel enregistrement dans Airtable
        await base("Subscribers").create([
            {
                fields: {
                    Email: email,
                    Date: new Date().toISOString()
                }
            }
        ]);

        res.json({ message: "Successfully subscribed!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// Servir les fichiers statiques
app.use(express.static('public'));

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
