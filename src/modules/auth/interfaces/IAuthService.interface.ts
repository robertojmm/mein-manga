import { SignOptions } from 'jsonwebtoken';

export interface IAuthService {
  options: SignOptions;
  sign(credentials: { emailOrUid: string; password: string }): Promise<string>;
}

/* export interface JwtOptions  {
  algorithm: string;
  expiresIn: number | string;
  jwtid: string;
} */
