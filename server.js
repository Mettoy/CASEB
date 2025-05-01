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

  // Filtro de temas no permitidos
  if (/pol[ií]tica|sexo|violencia|presidente|elecciones/i.test(pregunta)) {
    return res.json({
      respuesta: "Lo siento, no puedo responder preguntas sobre ese tema."
    });
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(pregunta)}&key=${API_KEY}&cx=${CX}`;
    const response = await fetch(url);
    const data = await response.json();

    // 🔎 Verificar si hubo un error en la API
    if (data.error) {
      console.error("❌ Error en la API:", data.error);
      return res.json({
        respuesta: "Error al conectar con Google: " + data.error.message
      });
    }

    // ✅ Si hay resultados
    if (data.items && data.items.length > 0) {
      return res.json({ respuesta: data.items[0].snippet });
    }

    // ⚠️ Sin resultados
    return res.json({
      respuesta: "No encontré información exacta, pero estoy aprendiendo más cada día."
    });
  } catch (error) {
    // ⚠️ Error general
    console.error("❗ Error general:", error);
    return res.json({
      respuesta: "Hubo un error buscando la información: " + error.message
    });
  }
});

// Servidor escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
