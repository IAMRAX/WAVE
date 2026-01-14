import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

logging.set_level(logging.NONE);

Object.assign(wisp.options, {
  allow_udp_streams: false,
  hostname_blacklist: [/example\.com/],
  dns_servers: ["1.1.1.3", "1.0.0.3"]
});

export default function handler(req, res) {
  if (req.method === 'GET' && req.headers.upgrade?.toLowerCase() === 'websocket') {
    wisp.routeRequest(req, req.socket, Buffer.alloc(0));
  } else {
    res.status(426).send('Upgrade Required');
  }
}
