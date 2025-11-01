import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  const usersRepositoryMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      // ARRANGE
      const userData: Partial<User> = { email: 'email', name: 'name' };
      const createdUser = { ...userData, id: 'userId' };
      usersRepositoryMock.create.mockResolvedValue(createdUser as User);
      // ACT
      const result = await service.create(userData);
      // ASSERT
      expect(result).toEqual(createdUser);
      expect(usersRepositoryMock.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('findAll', () => {
    it('should find all from repository', async () => {
      // ARRANGE
      const users = ['user1', 'user2'];
      usersRepositoryMock.findAll.mockResolvedValue(users as unknown as User[]);
      // ACT
      const result = await service.findAll();
      // ASSERT
      expect(result).toEqual(users);
      expect(usersRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find user by id from repository', async () => {
      // ARRANGE
      const user = 'user';
      usersRepositoryMock.findById.mockResolvedValue(user as unknown as User);
      // ACT
      const result = await service.findById('id');
      // ASSERT
      expect(result).toBe(user);
      expect(usersRepositoryMock.findById).toHaveBeenCalledWith('id');
    });
    it('should throw error 404 if no user is found', async () => {
      // ARRANGE
      usersRepositoryMock.findById.mockResolvedValue(null);
      // ACT & ASSERT
      await expect(service.findById('id')).rejects.toThrow(
        new NotFoundException('User with id "id" not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a user by id from repository', async () => {
      // ARRANGE
      const userId = 'userId';
      const updateData = { email: 'newEmail' };
      const updatedUser: Partial<User> = {
        id: userId,
        email: 'newEmail',
        name: 'name',
      };
      usersRepositoryMock.update.mockResolvedValue(updatedUser as User);
      // ACT
      const result = await service.update(userId, updateData);
      // ASSERT
      expect(result).toEqual(updatedUser);
      expect(usersRepositoryMock.update).toHaveBeenCalledWith(
        userId,
        updateData,
      );
    });
    it('should throw error 404 if no user is found', async () => {
      // ARRANGE
      usersRepositoryMock.update.mockResolvedValue(null);
      // ACT & ASSERT
      await expect(
        service.update('userId', { email: 'newEmail' }),
      ).rejects.toThrow(
        new NotFoundException('User with id "userId" not found'),
      );
    });
  });
  describe('delete', () => {
    it('should delete a user through the repository and delete it', async () => {
      const userId = 'userId';
      const deletedUser: Partial<User> = {
        id: userId,
        email: 'email',
        name: 'name',
      };
      usersRepositoryMock.delete.mockResolvedValue(deletedUser as User);
      const result = await service.delete(userId);
      expect(result).toEqual(deletedUser);
      expect(usersRepositoryMock.delete).toHaveBeenCalledWith(userId);
    });
    it('should throw error 404 if no user is found', async () => {
      // ARRANGE
      usersRepositoryMock.delete.mockResolvedValue(null);
      // ACT & ASSERT
      await expect(service.delete('userId')).rejects.toThrow(
        new NotFoundException('User with id "userId" not found'),
      );
    });
  });
});
