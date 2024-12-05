import { z } from 'zod';
import { BalanceChangeType } from '@prisma/client';

export const BALANCE_CHANGE_TYPE = z.enum(
  Object.keys(BalanceChangeType) as [keyof typeof BalanceChangeType]
);

export const AdjustCreditsSchema = z.object({
  body: z
    .object({
      userId: z.string().uuid(),
      count: z.number().int().min(1),
      operation: BALANCE_CHANGE_TYPE
    })
    .strict()
});
