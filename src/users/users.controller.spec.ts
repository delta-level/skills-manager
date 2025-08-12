import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  const mockUsersService: jest.Mocked<UsersService> = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all users', () => {
      // ARRANGE
      const expectedUsers = ['user1', 'user2'];
      mockUsersService.findAll.mockReturnValue(expectedUsers);
      // ACT
      const result = usersController.findAll(); // GET <urlBase>/users/
      // ASSERT
      expect(result).toEqual(expectedUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
    it.todo('should fail to get a user if it does not exist');
  });
});
