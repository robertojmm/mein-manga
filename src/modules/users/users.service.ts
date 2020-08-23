import { Injectable, Inject } from '@nestjs/common';
import { User as UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserCompleteDto } from './dto/userComplete.dto';
import { USER_REPOSITORY_TOKEN } from 'src/common/config/databaseTokens.constants';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/userCreate.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async create(userDto: UserCreateDto): Promise<UserCompleteDto> {
    const userEntity = Object.assign(new UserEntity(), userDto);
    const { password } = userEntity;

    userEntity.password = bcrypt.hashSync(password, 10);

    const userEntitySaved = await this.usersRepository.save(userEntity);
    return new UserCompleteDto(userEntitySaved);
  }

  public async getAllUsers(): Promise<UserCompleteDto[]> {
    const usersEntities = await this.usersRepository.find();

    return usersEntities.map(user => new UserCompleteDto(user));
  }

  public async getUserById(id: string): Promise<UserCompleteDto> {
    const userEntity = await this.usersRepository.findOne({
      where: { id },
    });

    return new UserCompleteDto(userEntity);
  }

  public async getUserByName(name: string): Promise<UserEntity> {
    const userEntity = await this.usersRepository.findOne({
      where: { name },
    });

    return userEntity;
  }
}
