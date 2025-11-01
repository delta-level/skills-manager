import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: Partial<User>): Promise<User> {
    return this.usersRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.usersRepository.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.usersRepository.delete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return deletedUser;
  }
}
