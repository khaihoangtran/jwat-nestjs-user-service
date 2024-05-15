import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@root/src/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  mockCreateSuccessResponse,
  mockFindUerById,
  mockMultipleResponse,
  mockSingleResponse,
  mockUser,
  mockUserRepository,
  searchUser,
  updateUserById,
  updateUserDto,
} from '@root/src/__mock__';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = await module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Encode password', () => {
    it('Should encode password when create new user', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('45678');
      const expectedOutput = await service.encodePassword('12345');
      expect(expectedOutput).toEqual('45678');
    });
  });

  describe('Create new user', () => {
    it('Should save user when create new user', async () => {
      jest.spyOn(service, 'encodePassword').mockResolvedValue('123456');
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(mockUser);
      const expectedOutput = await service.create(mockUser);
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(expectedOutput).toEqual(mockCreateSuccessResponse);
    });

    it('Should throw conflict exception when create new user with exists email', async () => {
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(mockUser);
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(mockUser);
      const expectedOutput = await service.create(mockUser);
      expect(expectedOutput).toEqual({
        status: HttpStatus.CONFLICT,
        error: ['Email already exists'],
        data: null,
      });
    });
  });

  describe('Find all users', () => {
    it('should return all users with empty arguments', async () => {
      jest.spyOn(repositoryMock, 'find').mockResolvedValue([mockUser]);
      const expectedOutput = await service.findAll();
      expect(repositoryMock.find).toHaveBeenCalled();
      expect(expectedOutput).toEqual(mockMultipleResponse);
    });

    it('should return users when find with arguments', async () => {
      jest.spyOn(repositoryMock, 'find').mockResolvedValue([mockUser]);
      const expectedOutput = await service.findAll(searchUser);
      expect(repositoryMock.find).toHaveBeenCalled();
      expect(expectedOutput).toEqual(mockMultipleResponse);
    });

    it('should return users when find by role', async () => {
      jest.spyOn(repositoryMock, 'find').mockResolvedValue([mockUser]);
      const expectedOutput = await service.findAll({
        ...searchUser,
        role: 'admin',
      });
      expect(repositoryMock.find).toHaveBeenCalled();
      expect(expectedOutput).toEqual(mockMultipleResponse);
    });

    it('should return users when find without full name & email', async () => {
      jest.spyOn(repositoryMock, 'find').mockResolvedValue([mockUser]);
      const expectedOutput = await service.findAll({
        ...searchUser,
        fullName: null,
        email: null,
      });
      expect(repositoryMock.find).toHaveBeenCalled();
      expect(expectedOutput).toEqual(mockMultipleResponse);
    });

    it('should throw not found exception when dose not find users', async () => {
      jest.spyOn(repositoryMock, 'find').mockResolvedValue([]);
      const expectedOutput = await service.findAll(searchUser);
      expect(repositoryMock.find).toHaveBeenCalled();
      expect(expectedOutput).toEqual({
        status: HttpStatus.NOT_FOUND,
        error: ['Users not found'],
        data: null,
      });
    });

    it('Should throw internal server error when find repository error', async () => {
      jest.spyOn(repositoryMock, 'find').mockImplementation(() => {
        throw new InternalServerErrorException();
      });
      const expectedOutput = await service.findAll(searchUser);
      expect(expectedOutput.data).toBeNull();
      expect(expectedOutput.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Find user by id', () => {
    it('Should return user when find by id', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(mockUser);
      const expectedOutput = await service.findOneById(mockFindUerById);
      expect(expectedOutput).toEqual(mockSingleResponse);
    });

    it('Should throw not found exception when find by wrong id', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(null);
      const expectedOutput = await service.findOneById(mockFindUerById);
      expect(expectedOutput).toEqual({
        status: HttpStatus.NOT_FOUND,
        error: ['User dose not exits!'],
        data: null,
      });
    });
  });

  describe('Update user by id', () => {
    it('Should update user and return this user by id', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(repositoryMock, 'update')
        .mockResolvedValue(new UpdateResult());
      const expectedOutput = await service.update(updateUserById);
      expect(expectedOutput).toEqual(mockSingleResponse);
    });

    it('Should update user with password and return this user by id', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(service, 'encodePassword').mockResolvedValue('123456');
      jest
        .spyOn(repositoryMock, 'update')
        .mockResolvedValue(new UpdateResult());
      const expectedOutput = await service.update({
        ...updateUserById,
        userDto: { ...updateUserDto, password: '123456' },
      });
      expect(expectedOutput).toEqual(mockSingleResponse);
    });

    it('Should throw not found exception with wrong user id', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(null);
      const expectedOutput = await service.update(updateUserById);
      expect(expectedOutput).toEqual({
        status: HttpStatus.NOT_FOUND,
        error: ['User dose not exits!'],
        data: null,
      });
    });

    it('Should throw internal server error when update repository error', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repositoryMock, 'update').mockImplementation(() => {
        throw new InternalServerErrorException();
      });
      const expectedOutput = await service.update(updateUserById);
      expect(expectedOutput.data).toBeNull();
      expect(expectedOutput.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Delete user by id', () => {
    it('Should delete user by id', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(mockUser);
      const expectedOutput = await service.delete(mockFindUerById);
      expect(repositoryMock.softDelete).toHaveBeenCalledTimes(1);
      expect(expectedOutput).toEqual(mockSingleResponse);
    });

    it('Should throw not found exception with wrong user id', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(null);
      const expectedOutput = await service.delete(mockFindUerById);
      expect(repositoryMock.softDelete).toHaveBeenCalledTimes(1);
      expect(expectedOutput).toEqual({
        status: HttpStatus.NOT_FOUND,
        error: ['User dose not exits!'],
        data: null,
      });
    });
    it('Should throw internal server error when delete repository error', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(repositoryMock, 'softDelete').mockImplementation(() => {
        throw new InternalServerErrorException();
      });
      const expectedOutput = await service.delete(updateUserById);
      expect(expectedOutput.data).toBeNull();
      expect(expectedOutput.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
