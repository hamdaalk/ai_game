const express = require('express');
const path = require('node:path');
const http = require('node:http');
const { ExpressPeerServer } = require('peer');

const app = express();
app.disable('x-powered-by');
app.enable('trust proxy');

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, { path: '/', proxied: true });
app.use('/peerjs', peerServer);

app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'survey-says.html')));

const port = Number(process.env.PORT) || 10000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Survey Says listening on 0.0.0.0:${port}`);
});
