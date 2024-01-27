import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@project/libs/validators';
import { Role } from '@project/libs/shared-types';
import { RoleRdo } from '@project/libs/rdo';
import { RolesService } from './roles.service';
import { mapToRole } from './role-mapper';

@ApiTags('User service')
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Getting role information' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role information',
    type: RoleRdo,
  })
  public async getRole(@Param('id') id: number): Promise<Role> {
    const roleModel = await this.rolesService.findById(id);
    return mapToRole(roleModel);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Getting role list' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role list',
    isArray: true,
    type: RoleRdo,
  })
  public async getRoleList(): Promise<Role[]> {
    const roleModels = await this.rolesService.findAll();
    return roleModels.map(mapToRole);
  }
}
