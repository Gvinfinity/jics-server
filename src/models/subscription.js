import { z } from 'zod';

const idSchema = z
  .string()
  .min(12)
  .regex(/\d{5}.{2,5}\d{4}/g, 'Invalid ID Format!')
  .transform((val) => val.toUpperCase())
  .optional()
  .or(z.literal(''));

export const subscription = z.object({
  volley: z.object({
    doubles: z.boolean(),
    teams: z.boolean(),
    pairId: idSchema,
    teamName: z.string(),
    teamMate1Id: idSchema,
    teamMate2Id: idSchema,
    teamMate3Id: idSchema,
  }),
  soccer: z.object({
    teams: z.boolean(),
    teamName: z.string(),
    teamMate1Id: idSchema,
    teamMate2Id: idSchema,
    teamMate3Id: idSchema,
    teamMate4Id: idSchema,
    teamMate5Id: idSchema,
    teamMate6Id: idSchema,
    teamMate7Id: idSchema,
    teamMate8Id: idSchema,
    teamMate9Id: idSchema,
  }),
  dodgeball: z.object({
    teams: z.boolean(),
    teamName: z.string(),
    teamMate1Id: idSchema,
    teamMate2Id: idSchema,
    teamMate3Id: idSchema,
    teamMate4Id: idSchema,
    teamMate5Id: idSchema,
    teamMate6Id: idSchema,
    teamMate7Id: idSchema,
    teamMate8Id: idSchema,
    teamMate9Id: idSchema,
  }),
  tableTennis: z.object({
    single: z.boolean(),
    doubles: z.boolean(),
    pairId: idSchema,
  }),
  chess: z.boolean(),
  domino: z.object({ doubles: z.boolean(), pairId: idSchema }),
  electronic: z.object({
    FIFA23: z.boolean(),
    // Tetris: z.boolean(),
    JustDance: z.boolean(),
  }),
  athletics: z.object({
    sprint50: z.boolean(),
    sprint100: z.boolean(),
    relay: z.boolean(),
    teamMate1Id: idSchema,
    teamMate2Id: idSchema,
    teamMate3Id: idSchema,
    longJump: z.boolean(),
    highJump: z.boolean(),
    shotPut: z.boolean(),
  }),
  // badminton: z.object({
  //   single: z.boolean(),
  //   doubles: z.boolean(),
  //   pairId: idSchema,
  // }),
});
