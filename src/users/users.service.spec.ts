import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<User>;

  const mockUser = {
    _id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    save: jest.fn().mockResolvedValue(true),
  };

  const mockUsers = [
    { _id: '1', email: 'test@example.com', password: 'hashedPassword' },
    { _id: '2', email: 'test2@example.com', password: 'hashedPassword' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'ff',
        email: 'test@example.com',
        password: 'password123',
        imagePath:"sdfghjkl"

      };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null); 
      const result = await service.createUser(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if the email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'ff',
        email: 'test@example.com',
        password: 'password123',
        imagePath:"sdfghjkl"
      };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser); 
      await expect(service.createUser(createUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      jest.spyOn(mockUserModel, 'find').mockResolvedValue(mockUsers);
      const result = await service.getUsers();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(mockUserModel, 'findById').mockResolvedValue(mockUsers[0]);
      const result = await service.getUserById('1');
      expect(result).toEqual(mockUsers[0]);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(mockUserModel, 'findById').mockResolvedValue(null);
      const result = await service.getUserById('1');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue({ ...mockUsers[0], ...updateUserDto });

      const result = await service.updateUser('1', updateUserDto);
      expect(result.email).toBe('updated@example.com');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateUserDto, { new: true });
    });
  });

  describe('removeUser', () => {
    it('should remove a user by ID', async () => {
      jest.spyOn(mockUserModel, 'findByIdAndDelete').mockResolvedValue(mockUsers[0]);
      const result = await service.removeUser('1');
      expect(result).toEqual(mockUsers[0]);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
