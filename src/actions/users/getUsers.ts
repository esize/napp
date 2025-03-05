"use server";

import { getUsers as getUsersData } from "@/data";
import { authedProcedure } from "@/actions/procedures";
import { z } from "zod";

const GetUsersSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const getUsersAction = authedProcedure
  .createServerAction()
  .input(GetUsersSchema)
  .handler(async ({ input }) => {
    try {
      const { users, totalCount, pageCount } = await getUsersData({
        page: input.page,
        pageSize: input.pageSize,
      });

      return { users, totalCount, pageCount };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  });
