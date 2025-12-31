import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "node:http";
import { hostname } from "node:os";

import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// -----------------------------
// Paths
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "public");

// -----------------------------
// Wisp Configuration
// -----------------------------
logging.set_level(logging.NONE);
Object.assign(wisp.options, {
  allow_udp_streams: false,
  hostname_blacklist: [/example\.com/],
  dns_servers: ["1.1.1.3", "1.0.0.3"]
});

// -----------------------------
// Express App
// -----------------------------
const app = express();

// COOP / COEP headers for SharedArrayBuffer + Wisp
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Static directories
app.use(express.static(publicPath));
app.use("/scram", express.static(scramjetPath));
app.use("/epoxy", express.static(epoxyPath));
app.use("/baremux", express.static(baremuxPath));
app.use(express.static(path.join(__dirname, "src")));

// -----------------------------
// Routes
// -----------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/404", (req, res) => {
  res.sendFile(path.join(publicPath, "404.html"));
});

app.get("/dsc", (req, res) => {
  res.sendFile(path.join(publicPath, "dsc", "index.html"));
});

app.get("/active", (req, res) => {
  res.sendFile(path.join(publicPath, "active", "index.html"));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicPath, "404.html"));
});

// -----------------------------
// HTTP + WebSocket Upgrade Server
// -----------------------------
const server = createServer(app);

// Wisp WebSocket upgrade handler
server.on("upgrade", (req, socket, head) => {
  if (req.url === "/wisp/" || req.url.startsWith("/wisp/") || req.url === "/wisp") {    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

// -----------------------------
// Start Server
// -----------------------------
const PORT = parseInt(process.env.PORT) || 3000;

server.listen(PORT, "0.0.0.0", () => {
  const address = server.address();
  console.log("Listening on:");
  console.log(`  http://localhost:${address.port}`);
  console.log(`  http://${hostname()}:${address.port}`);
  console.log(
    `  http://${address.family === "IPv6" ? `[${address.address}]` : address.address}:${address.port}`
  );
});
