import { Controller, Post, Body, UseGuards, Request, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login pengguna (Super Admin / Pengurus / Pengasuh)' })
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      return { success: false, message: 'Username atau password salah' };
    }
    const tokenData = await this.authService.login(user);
    return { success: true, data: tokenData };
  }

  @ApiOperation({ summary: 'Registrasi mandiri santri & pendaftaran HP baru' })
  @Post('register-santri')
  async registerSantri(@Body() body: any) {
    const data = await this.authService.registerSantri(body);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ambil profil pengguna aktif' })
  @Get('profile')
  getProfile(@Request() req: any) {
    const { passwordHash, ...userWithoutPassword } = req.user;
    return { success: true, data: userWithoutPassword };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Perbarui password admin / pengurus' })
  @Put('update-password')
  async updatePassword(@Request() req: any, @Body() body: any) {
    const result = await this.authService.updateAdminPassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
    return { success: true, data: result };
  }
}
