import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { Transform } from 'class-transformer';
import { CreateRequest } from '@root/src/proto/user';

// Create user input dto
export class CreateUserDto implements CreateRequest {
  @Transform(({ value }) => value.trim())
  @MaxLength(50)
  @MinLength(5)
  fullName: string;

  @Transform(({ value }) => value.trim())
  @MaxLength(50)
  @MinLength(5)
  userName: string;

  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @Transform(({ value }) => value.trim())
  @MinLength(6)
  password: string;
}
