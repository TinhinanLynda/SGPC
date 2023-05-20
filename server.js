const express = require("express");
const path = require("path");

const app = express();

// Définir le dossier statique pour les fichiers CSS, JS et les images
app.use(express.static(path.join(__dirname, "src")));

// Routes pour les différentes URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/a", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index2.html"));
});
// Route pour la page contenant la scène 3D
app.get("/scene", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "scene.html"));
});

// Démarrer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
