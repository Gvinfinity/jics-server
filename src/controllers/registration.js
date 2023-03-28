import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { subscription } from '../models/subscription.js';

import RegistrationService from '../services/registration.js';

import { EntryExistsError } from '../errors/EntryExists.js';

import recursiveCreate from '../utils/recursiveCreate.js';

const LIMITS = {
  volleyDoubles: 4,
  volleyTeams: 2,
  soccerTeams: 2,
  tableTennisDoubles: 3,
  tableTennisSingle: 5,
  domino: 5,
  FIFA23: 8,
  sprints: 6,
  relay: 2,
  shotPut: 6,
  longJump: 4,
  highJump: 4,
};

async function _verifyLimits(data) {
  const sex = data.sex;
  const course = data.course;

  let limited = [];

  if (data.subscription.volley.doubles) {
    const query = {
      where: {
        volley: {
          is: {
            doubles: true,
            pairId: {
              notIn: [null, ''],
            },
          },
        },
        student: {
          is: {
            course: course,
            sex: sex,
          },
        },
      },
    };

    if (
      (await RegistrationService.verifyNumber(query)) >= LIMITS.volleyDoubles
    ) {
      limited.push('volleyDoubles');
    }
  }

  if (data.subscription.volley.teams) {
    const query = {
      where: {
        volley: {
          is: {
            teams: true,
          },
          isNot: {
            teamMate1Id: '',
            teamMate2Id: '',
            teamMate3Id: '',
          },
        },
        student: {
          is: {
            course: course,
          },
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.volleyTeams) {
      console.log('Lim Volley');
      limited.push('volleyTeams');
    }
  }

  if (data.subscription.soccer.teams) {
    const query = {
      where: {
        soccer: {
          teams: true,
          teamMate1Id: {
            notIn: [null, ''],
          },
          teamMate2Id: {
            notIn: [null, ''],
          },
          teamMate3Id: {
            notIn: [null, ''],
          },
          teamMate4Id: {
            notIn: [null, ''],
          },
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.soccerTeams) {
      limited.push('soccerTeams');
    }
  }

  if (data.subscription.tableTennis.single) {
    const query = {
      where: {
        tableTennis: {
          single: true,
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if (
      (await RegistrationService.verifyNumber(query)) >=
      LIMITS.tableTennisSingle
    ) {
      limited.push('tableTennisSingle');
    }
  }

  if (data.subscription.tableTennis.single) {
    const query = {
      where: {
        tableTennis: {
          doubles: true,
          pairId: {
            notIn: [null, ''],
          },
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if (
      (await RegistrationService.verifyNumber(query)) >=
      LIMITS.tableTennisDoubles
    ) {
      limited.push('tableTennisDoubles');
    }
  }

  if (data.subscription.domino.doubles) {
    const query = {
      where: {
        domino: {
          doubles: true,
          pairId: {
            notIn: [null, ''],
          },
        },
        student: {
          course: course,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.domino) {
      limited.push('domino');
    }
  }

  if (data.subscription.electronic.FIFA23) {
    const query = {
      where: {
        electronic: {
          FIFA23: true,
        },
        student: {
          course: course,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.FIFA23) {
      limited.push('FIFA23');
    }
  }

  if (data.subscription.athletics.sprint50) {
    const query = {
      where: {
        athletics: {
          sprint50: true,
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.sprints) {
      limited.push('sprint50');
    }
  }

  if (data.subscription.athletics.sprint100) {
    const query = {
      where: {
        athletics: {
          sprint100: true,
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.sprints) {
      limited.push('sprint100');
    }
  }

  if (data.subscription.athletics.relay) {
    const query = {
      where: {
        athletics: {
          relay: true,
          teamMate1Id: {
            notIn: [null, ''],
          },
          teamMate2Id: {
            notIn: [null, ''],
          },
          teamMate3Id: {
            notIn: [null, ''],
          },
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.relay) {
      limited.push('relay');
    }
  }

  if (data.subscription.athletics.shotPut) {
    const query = {
      where: {
        athletics: {
          shotPut: true,
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.shotPut) {
      limited.push('shotPut');
    }
  }

  if (data.subscription.athletics.longJump) {
    const query = {
      where: {
        athletics: {
          longJump: true,
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.longJump) {
      limited.push('longJump');
    }
  }

  if (data.subscription.athletics.highJump) {
    const query = {
      where: {
        athletics: {
          highJump: true,
        },
        student: {
          course: course,
          sex: sex,
        },
      },
    };

    if ((await RegistrationService.verifyNumber(query)) >= LIMITS.highJump) {
      limited.push('highJump');
    }
  }

  return limited;
}

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
    return response
      .status(400)
      .json({ error: { message: fromZodError(error).message } });
  }

  const limited = await _verifyLimits(data);

  console.log(limited.length > 0);

  if (limited.length > 0) {
    console.log(':)');
    return response.status(418).json({ limited });
  }
  console.log(';-;');

  data = recursiveCreate(data);

  try {
    const student = await RegistrationService.create(data);
    return response.status(200).json({ student });
  } catch (error) {
    if (error instanceof EntryExistsError) {
      return response
        .status(400)
        .json({ error: { message: error.message, code: error.code } });
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
    return response.status(500).json({ error: fromZodError(error).message });
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
