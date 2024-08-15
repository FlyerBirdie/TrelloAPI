import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  columnId: number;
}