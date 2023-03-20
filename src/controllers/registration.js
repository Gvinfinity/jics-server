import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { subscription } from '../models/subscription.js';

import RegistrationService from '../services/registration.js';

import { EntryExistsError } from '../errors/EntryExists.js';

import recursiveCreate from '../utils/recursiveCreate.js';

async function register(request, response) {
  const name = z.string();
  const email = z.string().email();
  const id = z
    .string()
    .min(12)
    .regex(/\d{5}.{2,5}\d{4}/g, 'Invalid ID Format!')
    .transform((val) => val.toUpperCase());
  const course = z.enum(['MECA', 'SEG', 'EDIF', 'ENG']);
  const term = z.coerce.number();
  const learningModel = z.enum(['INT', 'SUB', 'SUP']);
  const sex = z.enum(['MAN', 'WOMAN']);

  const bodySchema = z.object({
    name,
    email,
    course,
    term,
    id,
    learningModel,
    sex,
    subscription,
  });

  let data;

  try {
    data = bodySchema.parse(request.body);
  } catch (error) {
    return response.status(400).json(fromZodError(error));
  }

  data = recursiveCreate(data);

  try {
    const student = await RegistrationService.create(data);
    console.log(student);
    return response.status(200).json({ student });
  } catch (error) {
    if (error instanceof EntryExistsError) {
      return response.status(400).json({ error: { message: error.message } });
    }
    console.error(error);
    return response
      .status(500)
      .json({ error: { message: 'Internal Server Error!' } });
  }
}

async function get(request, response) {
  const studentIdSchema = z
    .string()
    .min(12)
    .regex(/\d{5}.{2,6}\d{4}/g, 'Invalid ID Format!')
    .transform((val) => val.toUpperCase());

  let studentId;

  try {
    studentId = studentIdSchema.parse(request.params.studentId);
  } catch (error) {
    return response.status(500).json({ error: fromZodError(error) });
  }

  try {
    const student = await RegistrationService.get(studentId);
    return response.json({ student });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error!' });
  }
}

async function list(_request, response) {
  try {
    const subscriptions = await RegistrationService.list();
    return response.json({ subscriptions });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error!' });
  }
}

export default { register, get, list };
