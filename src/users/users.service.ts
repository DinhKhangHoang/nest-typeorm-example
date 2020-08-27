import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './userDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      order: {
        user_id: 'ASC',
      },
    });
  }

  public async create(user: UserDto): Promise<User> {
    return await this.usersRepository.save(user);
  }

  public async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) return user;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  public async update(id: number, newValue: UserDto): Promise<User | null> {
    const user = await this.usersRepository.findOneOrFail(id);
    if (user) {
      await this.usersRepository.update(id, newValue);
      return await this.usersRepository.findOne(id);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
