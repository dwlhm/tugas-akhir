import { User } from "../request";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
