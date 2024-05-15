import { UpdateRequest } from '@root/src/proto/user';

// Create user update DTO using Partial Type extends CreateUserDto
export class UpdateUserDto {
  fullName?: string;
  userName?: string;
  email?: string;
  password?: string;
}

export class UpdateUserByIdDto implements UpdateRequest {
  userId: string;
  userDto: UpdateUserDto;
}
