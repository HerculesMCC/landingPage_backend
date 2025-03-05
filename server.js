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
    'https://landing-page-talk-635k.vercel.app', // Votre vrai domaine Vercel
    'https://www.talksocialapp.com/'  // Si vous avez un domaine personnalisé
  ],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Connexion à Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Route pour l'inscription - changée pour correspondre au frontend
app.post("/subscribe", async (req, res) => {  // Retiré /api/
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

        res.json({ message: "🎉 You have been added to the wait list!" }); // Message cohérent avec le frontend
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error occurred. Please try again." }); // Message cohérent avec le frontend
    }
});

// Servir les fichiers statiques
app.use(express.static('public'));

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});