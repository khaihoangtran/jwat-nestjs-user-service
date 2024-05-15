import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import {
  mockCreateSuccessResponse,
  mockFindUerById,
  mockMultipleResponse,
  mockSingleResponse,
  mockUser,
  mockUserService,
  searchUser,
  updateUserById,
} from '@root/src/__mock__';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Create new user', () => {
    it('Should return user when call create controller', async () => {
      const expectedOutput = await controller.create(mockUser);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(mockUser);
      expect(expectedOutput).toEqual(mockCreateSuccessResponse);
    });
    it('Should throw conflict exception with exists email', async () => {
      jest.spyOn(service, 'create').mockResolvedValue({
        status: HttpStatus.CONFLICT,
        error: ['Email already exists'],
        data: null,
      });
      const expectedOutput = await controller.create(mockUser);
      expect(service.create).toHaveBeenCalledWith(mockUser);
      expect(expectedOutput).toEqual({
        status: HttpStatus.CONFLICT,
        error: ['Email already exists'],
        data: null,
      });
    });
  });

  describe('Find all user', () => {
    it('Should return all users', async () => {
      const expectedOutput = await controller.findAll(searchUser);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(searchUser);
      expect(expectedOutput).toEqual(mockMultipleResponse);
    });
  });

  describe('Find user by Id', () => {
    it('Should return user by Id', async () => {
      const expectedOutput = await controller.findOneById(mockFindUerById);
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(service.findOneById).toHaveBeenCalledWith(mockFindUerById);
      expect(expectedOutput).toEqual(mockSingleResponse);
    });
  });

  describe('Update user by Id', () => {
    it('Should update user by Id', async () => {
      const expectedOutput = await controller.update(updateUserById);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(updateUserById);
      expect(expectedOutput).toEqual(mockSingleResponse);
    });
  });

  describe('Delete user by Id', () => {
    it('Should delete user by Id', async () => {
      const expectedOutput = await controller.delete(mockFindUerById);
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(mockFindUerById);
      expect(expectedOutput).toEqual(mockSingleResponse);
    });
  });
});
