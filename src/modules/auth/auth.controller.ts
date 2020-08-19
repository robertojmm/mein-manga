import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local')
  public async loginLocal(
    @Body()
    auth: AuthDto,
  ): Promise<{ token: string }> {
    return {
      token: await this.authService.sign(auth),
    };
  }
}
