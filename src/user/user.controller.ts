import { Controller } from '@nestjs/common';
import {
  ResponseMultipleUser,
  ResponseSingleUser,
  UserServiceController,
  UserServiceControllerMethods,
} from '../proto/user';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { FindByIdDto, SearchUserDto } from './dtos/search.user.dto';
import { UpdateUserByIdDto } from './dtos/update.user.dto';

@Controller('user')
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  create(
    request: CreateUserDto,
  ):
    | ResponseSingleUser
    | Promise<ResponseSingleUser>
    | Observable<ResponseSingleUser> {
    return this.userService.create(request);
  }
  findAll(
    request: SearchUserDto,
  ):
    | ResponseMultipleUser
    | Promise<ResponseMultipleUser>
    | Observable<ResponseMultipleUser> {
    return this.userService.findAll(request);
  }
  findOneById(
    request: FindByIdDto,
  ):
    | ResponseSingleUser
    | Promise<ResponseSingleUser>
    | Observable<ResponseSingleUser> {
    return this.userService.findOneById(request);
  }
  update(
    request: UpdateUserByIdDto,
  ):
    | ResponseSingleUser
    | Promise<ResponseSingleUser>
    | Observable<ResponseSingleUser> {
    return this.userService.update(request);
  }
  delete(
    request: FindByIdDto,
  ):
    | ResponseSingleUser
    | Promise<ResponseSingleUser>
    | Observable<ResponseSingleUser> {
    return this.userService.delete(request);
  }
}
