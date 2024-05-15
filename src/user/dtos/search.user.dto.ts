import { IsOptional, IsInt, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindByIdRequest, SearchRequest } from '@root/src/proto/user';

// Create user update DTO using Partial Type extends CreateUserDto
export class SearchUserDto implements SearchRequest {
  @IsOptional()
  @Transform(({ value }) => value.trim())
  fullName?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  userName?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  role?: string;
}

export class FindByIdDto implements FindByIdRequest {
  @IsUUID()
  userId: string;
}
