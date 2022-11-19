import { User } from "./users/users.model";
/*
declare module 'restify' {
    export interface Request {
        authenticated: User
    }
}
*/
export {}
declare module 'restify' {
    interface Request {
        authenticated: User; // 👈️ turn off type checking
  }
}