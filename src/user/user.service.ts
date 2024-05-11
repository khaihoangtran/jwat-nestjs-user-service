import { UpdateUserByIdDto, UpdateUserDto } from './dtos/update.user.dto';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create.user.dto';
import { ResponseMultipleUser, ResponseSingleUser } from '../proto/user';
import { UserRole } from './enums/user.roles';
import { FindByIdDto, SearchUserDto } from './dtos/search.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Encode User's password
  private async encodePassword(password: string): Promise<string> {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }


  public async create({
    fullName,
    userName,
    email,
    password,
  }: CreateUserDto): Promise<ResponseSingleUser> {
    let user: User = await this.userRepository.findOne({ where: { email } });

    if (user) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['Email already exists'],
        data: null,
      };
    }
    user = new User();

    user.fullName = fullName;
    user.userName = userName;
    user.email = email;
    user.password = await this.encodePassword(password);

    await this.userRepository.save(user);

    return { status: HttpStatus.CREATED, error: null, data: user };
  }

  // Find all users service
  async findAll(searchUserDto?: SearchUserDto): Promise<ResponseMultipleUser> {
    if (!searchUserDto) {
      const users = await this.userRepository.find();
      return { status: HttpStatus.OK, error: null, data: users };
    }
    const full_name = searchUserDto.fullName ?? '';
    const user_name = searchUserDto.userName ?? '';
    const email = searchUserDto.email ?? '';
    const userRole = searchUserDto.role ?? null;
    const limit = searchUserDto.limit ?? null;

    try {
      const users = await this.userRepository.find({
        where: {
          userName: ILike(`%${user_name}%`),
          fullName: ILike(`%${full_name}%`),
          email: ILike(`%${email}%`),
          role: !userRole
            ? In([UserRole.ADMIN, UserRole.USER])
            : UserRole.ADMIN.includes(userRole.toLowerCase())
              ? UserRole.ADMIN
              : UserRole.USER.includes(userRole.toLowerCase())
                ? UserRole.USER
                : In([UserRole['notFound']]),
        },
        take: limit,
      });
      if (users.length === 0) throw new NotFoundException('Users not found');
      return { status: HttpStatus.OK, error: null, data: users };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: [error],
        data: null,
      };
    }
  }

  // Find one user by id service
  async findOneById(search: FindByIdDto): Promise<ResponseSingleUser> {
    const user = await this.userRepository.findOne({
      where: { userId: search.userId },
    });
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['User dose not exits!'],
        data: null,
      };
    }
    return { status: HttpStatus.OK, error: null, data: user };
  }

  // Update user service
  async update(
    updateUserByIdDto: UpdateUserByIdDto,
  ): Promise<ResponseSingleUser> {
    const userId: string = updateUserByIdDto.userId;
    let updateUserDto: UpdateUserDto = updateUserByIdDto.userDto;
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('User dose not exits!');
    }
    if (updateUserDto.password) {
      const password = await this.encodePassword(updateUserDto.password);
      updateUserDto = { ...updateUserDto, password };
    }
    try {
      await this.userRepository.update(userId, updateUserDto);
      const user = await this.userRepository.findOne({ where: { userId } });
      return { status: HttpStatus.OK, error: null, data: user };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: [error],
        data: null,
      };
    }
  }

  // Delete user service
  async delete(search: FindByIdDto): Promise<ResponseSingleUser> {
    const user = await this.userRepository.findOneBy({ userId: search.userId });
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['User dose not exits!'],
        data: null,
      };
    }
    try {
      await this.userRepository.softDelete(search.userId);
      return { status: HttpStatus.OK, error: null, data: user };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: [error],
        data: null,
      };
    }
  }

}
