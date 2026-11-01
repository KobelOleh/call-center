import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateLicenceDto {
  @IsString()
  @IsNotEmpty()
  tariffPlan!: string;

  @IsInt()
  @Min(1)
  seats!: number;
}
