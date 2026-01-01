import { TokenInfo } from './token.entity';

export type LoginResponse = TokenInfo & {
  exp: number;
};
