require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CX;

app.post("/preguntar", async (req, res) => {
  const { pregunta } = req.body;

  if (/pol[ií]tica|sexo|violencia|presidente|elecciones/i.test(pregunta)) {
    return res.json({ respuesta: "Lo siento, no puedo responder preguntas sobre ese tema." });
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(pregunta)}&key=${API_KEY}&cx=${CX}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.items && data.items.length > 0) {
      return res.json({ respuesta: data.items[0].snippet });
    } else {
      return res.json({ respuesta: "No encontré información exacta, pero estoy aprendiendo más cada día." });
    }
  } catch (error) {
    return res.json({ respuesta: "Hubo un error buscando la información." });
  }
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
