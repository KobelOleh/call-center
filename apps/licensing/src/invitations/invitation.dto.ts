import { IsNotEmpty, IsString } from 'class-validator';
import { NormalizedEmail } from '../common/normalized-email.decorator.js';

export class InviteDto {
  @NormalizedEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  licenceId!: string;
}

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
