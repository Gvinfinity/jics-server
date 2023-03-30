import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import https from 'https';

import RegistrationRouter from './routers/registration.js';

const app = express();

const cert = fs.readFileSync(
  '/etc/letsencrypt/live/api.jicsifpe.com.br/cert.pem'
);

const pkey = fs.readFileSync(
  '/etc/letsencrypt/live/api.jicsifpe.com.br/privkey.pem'
);

app.use(cors());
app.use(express.json());

app.use(RegistrationRouter);

https.createServer({ key: pkey, cert: cert }, app).listen(8000, () => {
  console.log('Server is running on port 8000');
});
