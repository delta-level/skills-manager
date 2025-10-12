import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';

describe('UsersController', () => {
  let usersController: UsersController;
  const mockUsersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
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

  describe('getAll', () => {
    it('should get all users', async () => {
      // ARRANGE
      const expectedUsers = ['user1', 'user2'];
      mockUsersService.findAll.mockResolvedValue(
        expectedUsers as unknown as UserDocument[],
      );
      // ACT
      const result = await usersController.findAll(); // GET <urlBase>/users/
      // ASSERT
      expect(result).toEqual(expectedUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
    it.todo('should fail to get a user if it does not exist');
  });
});
