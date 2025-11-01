import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  // let typeormRepository: Repository<User>;

  const mockUser: User = {
    id: '507f1f77-bcf8-6cd7-9943-9011abcdef01',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTypeormRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    // typeormRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockTypeormRepository.find.mockResolvedValue(users);

      const result = await repository.findAll();

      expect(mockTypeormRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = '507f1f77-bcf8-6cd7-9943-9011abcdef01';
      mockTypeormRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await repository.findById(userId);

      expect(mockTypeormRepository.findOneBy).toHaveBeenCalledWith({
        id: userId,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const userId = '507f1f77-bcf8-6cd7-9943-9011abcdef01';
      mockTypeormRepository.findOneBy.mockResolvedValue(null);

      const result = await repository.findById(userId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '507f1f77-bcf8-6cd7-9943-9011abcdef01';
      const updateData = { name: 'Jane Doe' };
      const updatedUser = { ...mockUser, ...updateData };

      mockTypeormRepository.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepository.findOneBy.mockResolvedValue(updatedUser);

      const result = await repository.update(userId, updateData);

      expect(mockTypeormRepository.update).toHaveBeenCalledWith(
        userId,
        updateData,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userId = '507f1f77-bcf8-6cd7-9943-9011abcdef01';
      mockTypeormRepository.findOneBy.mockResolvedValue(mockUser);
      mockTypeormRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete(userId);

      expect(mockTypeormRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });
});
