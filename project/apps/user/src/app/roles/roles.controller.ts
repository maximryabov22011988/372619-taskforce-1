import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Role } from '@project/libs/shared-types';
import { RoleRdo } from '@project/libs/rdo';
import { RolesService } from './roles.service';
import { mapToRole } from './role-mapper';

@Controller({
  path: 'roles',
  version: '1',
})
@ApiTags('User service')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Getting role information' })
  @ApiOkResponse({
    description: 'Role information successfully received',
    type: RoleRdo,
  })
  @ApiNotFoundResponse({ description: 'Role was not found' })
  public async getRole(@Param('id') id: number): Promise<Role> {
    const roleModel = await this.rolesService.findById(id);
    return mapToRole(roleModel);
  }

  @Get()
  @ApiOperation({ summary: 'Getting role list' })
  @ApiOkResponse({
    description: 'Role list successfully received',
    isArray: true,
    type: RoleRdo,
  })
  public async getRoleList(): Promise<Role[]> {
    const roleModels = await this.rolesService.findAll();
    return roleModels.map(mapToRole);
  }
}
