import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
