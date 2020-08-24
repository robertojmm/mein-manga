import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserCompleteDto } from './dto/userComplete.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@Controller('users')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  getAllUsers(): Promise<UserCompleteDto[]> {
    return this.usersService.getAllUsers();
  }

  @Post()
  @Roles('admin')
  createUser(@Body() userCreateDto: UserCreateDto): Promise<UserCompleteDto> {
    return this.usersService.create(userCreateDto);
  }

  @Put()
  @Roles('admin')
  updateUser(@Body() userDto: UserUpdateDto): Promise<UserCompleteDto> {
    return this.usersService.update(userDto);
  }

  @Delete(':id')
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
