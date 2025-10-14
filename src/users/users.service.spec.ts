import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  const usersRepositoryMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
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
      const user: User = { email: 'email', name: 'name' };
      const createdUser = { ...user, _id: 'userId' };
      usersRepositoryMock.create.mockResolvedValue(createdUser as UserDocument);
      // ACT
      const result = await service.create(user);
      // ASSERT
      expect(result).toEqual(createdUser);
      expect(usersRepositoryMock.create).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should find all from repository', async () => {
      // ARRANGE
      const users = ['user1', 'user2'];
      usersRepositoryMock.findAll.mockResolvedValue(
        users as unknown as UserDocument[],
      );
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
      usersRepositoryMock.findById.mockResolvedValue(
        user as unknown as UserDocument,
      );
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
      const userId = 'userId';
      const updateData = { email: 'newEmail' };
      const updatedUser: Partial<UserDocument> = {
        _id: userId as unknown as Types.ObjectId,
        email: 'newEmail',
        name: 'name',
      };
      usersRepositoryMock.update.mockResolvedValue(updatedUser as UserDocument);
      const result = await service.update(userId, updateData);
      expect(result).toEqual(updatedUser);
      expect(usersRepositoryMock.update).toHaveBeenCalledWith(
        userId,
        updateData,
      );
    });
    it('should throw error 404 if no user is found', async () => {
      usersRepositoryMock.update.mockResolvedValue(null);
      await expect(
        service.update('userId', { email: 'newEmail' }),
      ).rejects.toThrow(
        new NotFoundException('User with id "userId" not found'),
      );
    });
  });
});
