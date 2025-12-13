import express from "express";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/dsc", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dsc", "index.html"));
});

app.get("/active", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "active", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
