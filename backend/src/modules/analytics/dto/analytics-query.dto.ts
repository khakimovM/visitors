import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class VisitorsQueryDto {
  @ApiProperty({ example: "2025-10-01", description: "Boshlanish sanasi" })
  @Type(() => Date)
  @IsDate()
  from: Date;

  @ApiProperty({ example: "2025-10-21", description: "Tugash sanasi" })
  @Type(() => Date)
  @IsDate()
  to: Date;

  @ApiPropertyOptional({ example: 1, description: "Filial userId (faqat admin)" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  branchId?: number;
}

export class DayQueryDto {
  @ApiProperty({ example: "2025-10-21", description: "Statistika uchun sana" })
  @Type(() => Date)
  @IsDate()
  day: Date;
}
