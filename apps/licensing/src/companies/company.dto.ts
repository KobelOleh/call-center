import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class ChangeRoleDto {
  @IsString()
  @IsNotEmpty()
  role!: string;
}
