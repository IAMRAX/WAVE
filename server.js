import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "node:http";
import { hostname } from "node:os";

import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "public");

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
  allow_udp_streams: false,
  hostname_blacklist: [/example\.com/],
  dns_servers: ["1.1.1.3", "1.0.0.3"]
});

const app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.static(publicPath));
app.use("/scram", express.static(scramjetPath));
app.use("/epoxy", express.static(epoxyPath));
app.use("/baremux", express.static(baremuxPath));
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/dsc", (req, res) => {
  res.sendFile(path.join(publicPath, "dsc", "index.html"));
});

app.get("/active", (req, res) => {
  res.sendFile(path.join(publicPath, "active", "index.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicPath, "404.html"));
});

const server = createServer(app);

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

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

function shutdown() {
  console.log("SIGTERM received: closing server");
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
