import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
      },

      phone: {
        type: "string",
        required: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});