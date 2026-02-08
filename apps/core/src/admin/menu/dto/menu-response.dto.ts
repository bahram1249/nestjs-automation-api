import { ApiProperty, OmitType } from '@nestjs/swagger';

export class MenuResponseDto {
  @ApiProperty({ example: 1, description: 'Menu ID' })
  id: number;

  @ApiProperty({ example: 'Dashboard', description: 'Menu title' })
  title: string;

  @ApiProperty({ example: '/dashboard', description: 'Menu URL' })
  url: string;

  @ApiProperty({ example: 'home-icon', description: 'Menu icon class' })
  icon: string;

  @ApiProperty({ example: 'menu-item', description: 'CSS class name' })
  className: string;

  @ApiProperty({
    example: 1,
    description: 'Parent menu ID',
    required: false,
    nullable: true,
  })
  parentMenuId?: number;

  @ApiProperty({ example: 1, description: 'Menu order', required: false })
  order?: number;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Update timestamp',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => [SubMenuDto],
    description: 'Sub menus',
    required: false,
  })
  subMenus?: SubMenuDto[];
}

// Create SubMenuDto by omitting subMenus field from MenuResponseDto
// This avoids circular reference issues in Swagger
export class SubMenuDto extends OmitType(MenuResponseDto, [
  'subMenus',
] as const) {}
