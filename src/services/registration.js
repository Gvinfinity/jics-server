import { PrismaClient } from '@prisma/client';

import { EntryExistsError } from '../errors/EntryExists.js';

const PRISMA_ERRORS = {
  alreadyExists: 'P2002',
};

const prisma = new PrismaClient();

async function create(data) {
  try {
    const student = await prisma.student.create({ data: data });
    return student;
  } catch (error) {
    if (error.code == PRISMA_ERRORS.alreadyExists) {
      throw new EntryExistsError(error.meta.target);
    } else {
      throw error;
    }
  }
}

async function get(id) {
  return await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      subscription: {
        include: {
          volley: true,
          soccer: true,
          dodgeball: true,
          tableTennis: true,
          domino: true,
          electronic: true,
          athletics: true,
          // badminton: true,
        },
      },
    },
  });
}

async function list() {
  return await prisma.subscription.findMany({
    include: {
      student: true,
      volley: true,
      soccer: true,
      dodgeball: true,
      tableTennis: true,
      domino: true,
      electronic: true,
      athletics: true,
      // badminton: true,
    },
  });
}

async function verifyNumber(query) {
  return (await prisma.subscription.findMany(query)).length;
}

export default { create, get, list, verifyNumber };
