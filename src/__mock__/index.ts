import { ResponseMultipleUser, ResponseSingleUser } from '../proto/user';
import { FindByIdDto, SearchUserDto } from '../user/dtos/search.user.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enums/user.roles';
import { UpdateUserByIdDto, UpdateUserDto } from '../user/dtos/update.user.dto';

export const mockUser: User = {
  userId: '123',
  fullName: 'Khai Hoang Tran',
  userName: 'trankhaihoang',
  email: 'hoang@gmail.com',
  password: '123456',
  role: UserRole.ADMIN,
  deletedAt: null,
  createdAt: new Date('2024-06-06'),
  updatedAt: new Date('2024-06-06'),
};

export const mockFindUerById: FindByIdDto = {
  userId: '123123123123',
};

export const updateUserDto: UpdateUserDto = {
  fullName: 'Khai Hoang Tran',
  userName: 'trankhaihoang',
  email: 'hoang@gmail.com',
};

export const searchUser: SearchUserDto = {
  email: 'hello',
  fullName: 'hello',
};

export const updateUserById: UpdateUserByIdDto = {
  userId: '123123123123',
  userDto: updateUserDto,
};

export const mockSingleResponse: ResponseSingleUser = {
  status: 200,
  error: null,
  data: mockUser,
};

export const mockCreateSuccessResponse: ResponseSingleUser = {
  status: 201,
  error: null,
  data: mockUser,
};

export const mockMultipleResponse: ResponseMultipleUser = {
  status: 200,
  error: null,
  data: [mockUser],
};

export const mockUserRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

export const mockUserService = {
  create: jest.fn().mockResolvedValue(mockCreateSuccessResponse),
  findAll: jest.fn().mockResolvedValue(mockMultipleResponse),
  findOneById: jest.fn().mockResolvedValue(mockSingleResponse),
  update: jest.fn().mockResolvedValue(mockSingleResponse),
  delete: jest.fn().mockResolvedValue(mockSingleResponse),
};
