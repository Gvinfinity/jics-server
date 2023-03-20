import { z } from 'zod';

export const subscription = z.object({
  volley: z.object({
    doubles: z.boolean(),
    teams: z.boolean(),
    pairId: z.string(),
    teamName: z.string(),
  }),
  soccer: z.object({ teams: z.boolean(), teamName: z.string() }),
  dodgeball: z.object({ teams: z.boolean(), teamName: z.string() }),
  tableTennis: z.object({
    single: z.boolean(),
    doubles: z.boolean(),
    pairId: z.string(),
  }),
  chess: z.boolean(),
  domino: z.object({ doubles: z.boolean(), pairId: z.string() }),
  electronic: z.object({
    FIFA23: z.boolean(),
    Tetris: z.boolean(),
    JustDance: z.boolean(),
  }),
  athletics: z.object({
    sprint50: z.boolean(),
    sprint100: z.boolean(),
    relay: z.boolean(),
    pairId: z.string(),
    longJump: z.boolean(),
    highJump: z.boolean(),
    shotPut: z.boolean(),
  }),
  badminton: z.object({
    single: z.boolean(),
    doubles: z.boolean(),
    pairId: z.string(),
  }),
});
