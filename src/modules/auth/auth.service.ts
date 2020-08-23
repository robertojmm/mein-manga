import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  async login(user: UserCompleteDto): Promise<{ access_token: string }> {
    const payload = {
      username: user.username,
      sub: user.uid,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
