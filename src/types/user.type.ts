import { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{
  select: { [K in keyof Required<Prisma.UserSelect>]: true };
}>;
