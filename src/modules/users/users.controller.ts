import { Controller, Inject, Get, Post, Put, Delete } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from 'src/common/config/databaseTokens.constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Get()
  getAllUsers() {
    console.log('xd');
  }

  @Post()
  createUser() {
    console.log('xd');
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
