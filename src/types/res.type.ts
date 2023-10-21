import { User } from "./user.type";

export default interface APIResult {
  ok: boolean;
  message: string;
}
export interface APIResultWithUser extends APIResult {
  user: User;
}
