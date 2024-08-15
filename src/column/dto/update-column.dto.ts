import { IsString, IsOptional } from 'class-validator';

export class UpdateColumnDto {
  @IsOptional()
  @IsString()
  title?: string;
}
