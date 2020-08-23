import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserCompleteDto } from './dto/userComplete.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<UserCompleteDto[]> {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(@Body() userCreateDto: UserCreateDto): Promise<UserCompleteDto> {
    return this.usersService.create(userCreateDto);
  }

  @Put()
  updateUser(@Body() userDto: UserUpdateDto): Promise<UserCompleteDto> {
    return this.usersService.update(userDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
