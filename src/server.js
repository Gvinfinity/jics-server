import cors from 'cors';
import express from 'express';

import RegistrationRouter from './routers/registration.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(RegistrationRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
