import express from 'express';

import RegistrationController from '../controllers/registration.js';

const routes = express.Router();

routes.post('/register', RegistrationController.register);

routes.get('/:studentId', RegistrationController.get);

routes.get('/', RegistrationController.list);

export default routes;
