import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Policies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('policies')
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  @ApiOperation({ summary: 'Daftar seluruh kebijakan (Policy Engine)' })
  @Get()
  async getAllPolicies() {
    const data = await this.policiesService.getAllPolicies();
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Detail kebijakan berdasarkan ID' })
  @Get(':id')
  async getPolicyById(@Param('id') id: string) {
    const data = await this.policiesService.getPolicyById(id);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Buat kebijakan baru (Jam Tidur, Belajar, Mengaji & Pembatasan App)' })
  @Post()
  async createPolicy(@Request() req: any, @Body() body: any) {
    const data = await this.policiesService.createPolicy(body, req.user.id, req.user.fullName);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Perbarui kebijakan' })
  @Put(':id')
  async updatePolicy(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const data = await this.policiesService.updatePolicy(id, body, req.user.id, req.user.fullName);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Hapus kebijakan' })
  @Delete(':id')
  async deletePolicy(@Request() req: any, @Param('id') id: string) {
    const data = await this.policiesService.deletePolicy(id, req.user.id, req.user.fullName);
    return { success: true, data };
  }
}
