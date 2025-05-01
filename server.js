const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const CX = process.env.CX;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/buscar", async (req, res) => {
  const query = req.body.query;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    res.json(datos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
