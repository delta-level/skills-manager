import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('UsersController', () => {
  let usersController: UsersController;
  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      // ARRANGE
      const user: User = { email: 'email', name: 'name' };
      const createdUser = { ...user, _id: 'userId' };
      mockUsersService.create.mockResolvedValue(createdUser as UserDocument);
      // ACT
      const result = await usersController.create(user);
      // ASSERT
      expect(result).toEqual(createdUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should get all users', async () => {
      // ARRANGE
      const expectedUsers = ['user1', 'user2'];
      mockUsersService.findAll.mockResolvedValue(
        expectedUsers as unknown as UserDocument[],
      );
      // ACT
      const result = await usersController.findAll();
      // ASSERT
      expect(result).toEqual(expectedUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      // ARRANGE
      const user = 'user';
      mockUsersService.findById.mockResolvedValue(
        user as unknown as UserDocument,
      );
      // ACT
      const result = await usersController.findById('id');
      // ASSERT
      expect(result).toBe(user);
      expect(mockUsersService.findById).toHaveBeenCalledWith('id');
    });
    it('should throw error 404 if no user is found', async () => {
      // ARRANGE
      mockUsersService.findById.mockRejectedValue(
        new NotFoundException('User with id "id" not found'),
      );
      // ACT & ASSERT
      await expect(usersController.findById('id')).rejects.toThrow(
        new NotFoundException('User with id "id" not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      // ARRANGE
      const userId = 'userId';
      const updateData = { email: 'newEmail' };
      const updatedUser: Partial<UserDocument> = {
        _id: userId as unknown as Types.ObjectId,
        email: 'newEmail',
        name: 'name',
      };
      mockUsersService.update.mockResolvedValue(updatedUser as UserDocument);
      // ACT
      const result = await usersController.update(userId, updateData);
      // ASSERT
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateData);
    });
    it('should throw error 404 if no user is found', async () => {
      // ARRANGE
      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User with id "userId" not found'),
      );
      // ACT & ASSERT
      await expect(
        usersController.update('userId', { email: 'newEmail' }),
      ).rejects.toThrow(
        new NotFoundException('User with id "userId" not found'),
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      // ARRANGE
      const userId = 'userId';
      const deletedUser: Partial<UserDocument> = {
        _id: userId,
        email: 'email',
        name: 'name',
      };
      mockUsersService.delete.mockResolvedValue(deletedUser as UserDocument);
      // ACT
      const result = await usersController.delete(userId);
      // ASSERT
      expect(result).toEqual(deletedUser);
      expect(mockUsersService.delete).toHaveBeenCalledWith(userId);
    });
    it('should throw error 404 if no user is found', async () => {
      // ARRANGE
      mockUsersService.delete.mockRejectedValue(
        new NotFoundException('User with id "userId" not found'),
      );
      // ACT & ASSERT
      await expect(usersController.delete('userId')).rejects.toThrow(
        new NotFoundException('User with id "userId" not found'),
      );
    });
  });
});
