const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const BING_KEY = process.env.BING_API_KEY;

app.post("/consultar", async (req, res) => {
  const { pregunta } = req.body;

  // Filtro de seguridad
  const prohibido = ["política", "presidente", "partido", "elecciones", "violación", "asesinato", "sexo"];
  if (prohibido.some(p => pregunta.toLowerCase().includes(p))) {
    return res.json({ respuesta: "❌ Lo siento, no puedo responder esa pregunta." });
  }

  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(pregunta)}`;

  try {
    const r = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": BING_KEY
      }
    });
    const json = await r.json();

    const resultado = json.webPages?.value?.[0]?.snippet || "❌ No se encontró información precisa.";
    res.json({ respuesta: resultado });

  } catch (err) {
    console.error("Error:", err);
    res.json({ respuesta: "❌ Hubo un error al buscar la información." });
  }
});

app.listen(3000, () => {
  console.log("✅ CASEB Server activo en http://localhost:3000");
});
