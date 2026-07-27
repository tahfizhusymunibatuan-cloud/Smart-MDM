import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Daftar semua pengguna' })
  @Get()
  async getAllUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('group') group?: string,
  ) {
    const data = await this.usersService.getAllUsers(search, role, group);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Detail pengguna berdasarkan ID' })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const data = await this.usersService.getUserById(id);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Tambah pengguna baru (Super Admin)' })
  @Roles('SUPER_ADMIN')
  @Post()
  async createUser(@Request() req: any, @Body() body: any) {
    const data = await this.usersService.createUser(body, req.user.id, req.user.fullName);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Perbarui pengguna (Super Admin)' })
  @Roles('SUPER_ADMIN')
  @Put(':id')
  async updateUser(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const data = await this.usersService.updateUser(id, body, req.user.id, req.user.fullName);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Hapus pengguna (Super Admin)' })
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  async deleteUser(@Request() req: any, @Param('id') id: string) {
    const data = await this.usersService.deleteUser(id, req.user.id, req.user.fullName);
    return { success: true, data };
  }
}
