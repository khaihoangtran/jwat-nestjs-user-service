import { CreateUserDto } from './create.user.dto';
import { UpdateRequest } from '@root/src/proto/user';

// Create user update DTO using Partial Type extends CreateUserDto
export class UpdateUserDto extends CreateUserDto {}

export class UpdateUserByIdDto implements UpdateRequest {
  userId: string;
  userDto: UpdateUserDto;
}
