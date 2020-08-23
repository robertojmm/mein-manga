import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserCompleteDto } from './dto/userComplete.dto';

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
  updateUser() {
    console.log('xd');
  }

  @Delete(':id')
  deleteUser() {
    console.log('xd');
  }
}
