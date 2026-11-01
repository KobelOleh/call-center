import { IsNotEmpty, IsString } from 'class-validator';
import { NormalizedEmail } from '../common/normalized-email.decorator.js';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @NormalizedEmail()
  email!: string;
}
