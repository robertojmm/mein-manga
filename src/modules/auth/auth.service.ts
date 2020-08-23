import { Injectable, Inject } from '@nestjs/common';
import { IAuthService } from './interfaces/IAuthService.interface';
import { AuthDto } from './dto/auth.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY_TOKEN } from 'src/common/config/databaseTokens.constants';
import { Repository } from 'typeorm';
import { UserNotFoundException } from 'src/common/exceptions';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserCompleteDto } from '../users/dto/userComplete.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByName(username);

    if (user && bcrypt.compareSync(pass, user.password)) {
      return new UserCompleteDto(user);
    }

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async login(user: UserCompleteDto): Promise<{ access_token: string }> {
    const payload = { username: user.name, sub: user.uid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /* public async sign(credentials: AuthDto): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: {
        uid: credentials.emailOrUid,
      },
    });
    if (!user) {
      throw new UserNotFoundException(credentials.emailOrUid);
    }
    //const x = bcrypt.hashSync(credentials.password, 10);
    if (!bcrypt.compareSync(credentials.password, user.password)) {
      throw new UserNotFoundException(credentials.emailOrUid);
    }

    const payload = {
      id: user.uid,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_KEY || 'Secret', this.options);
  }

  public refresh(user: { uid: string; email: string }): string {
    const payload = {
      id: user.uid,
      email: user.email,
    };
    return jwt.sign(payload, process.env.JWT_KEY || 'Secret', this.options);
  } */
}
