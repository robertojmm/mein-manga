import { Injectable, Inject } from '@nestjs/common';
import { IAuthService } from './interfaces/IAuthService.interface';
import { AuthDto } from './dto/auth.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY_TOKEN } from 'src/common/config/databaseTokens.constants';
import { Repository } from 'typeorm';
import { UserNotFoundException } from 'src/common/exceptions';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  public options: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: '2 days',
    jwtid: process.env.JWT_ID || '',
  };

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async sign(credentials: AuthDto): Promise<string> {
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
  }
}
