import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getWelcome() {
    return {
      status: 'online',
      name: 'Smart MDM Pondok Backend API',
      version: '1.0.0',
      message: 'Sistem Monitoring HP Santri Smart MDM Pondok Berjalan Normal',
      swaggerDocs: '/api/docs',
    };
  }
}
