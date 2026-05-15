import { FileDto } from '@/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ description: 'Họ và tên thành viên' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại thành viên' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Giới tính thành viên' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'Email thành viên' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Ngày sinh' })
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({ description: 'Nghề nghiệp' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ description: 'Trường học' })
  @IsOptional()
  @IsString()
  school?: string;

  @ApiProperty({ description: 'ID chứng chỉ mục tiêu' })
  @IsOptional()
  @IsString()
  targetCertId?: string;

  @ApiProperty({ description: 'Điểm mục tiêu' })
  @IsOptional()
  @IsString()
  targetScore?: string;

  @ApiProperty({ description: 'URL avatar của thành viên' })
  @IsOptional()
  avatar?: FileDto[];
}
