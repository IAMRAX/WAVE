import { createBareServer } from "@tomphttp/bare-server-node";

const bare = createBareServer("/bare/");

export default function handler(req, res) {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, req.socket, Buffer.alloc(0));
  } else {
    res.status(400).send("Invalid bare request");
  }
}
