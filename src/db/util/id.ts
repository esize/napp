import "server-only";
import { nanoid } from "nanoid";

export const createId = () => nanoid(21);
