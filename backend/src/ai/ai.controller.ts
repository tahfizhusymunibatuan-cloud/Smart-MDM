import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AI Assistant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @ApiOperation({ summary: 'Ringkasan harian AI & rekomendasi pembinaan santri' })
  @Get('daily-summary')
  async getDailySummary(@Query('date') date?: string) {
    const data = await this.aiService.getDailySummary(date);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Konsultasi interaktif AI Asisten Pembinaan' })
  @Post('consult')
  async consultAI(@Body() body: { question: string }) {
    const data = await this.aiService.askAICoach(body.question);
    return { success: true, data };
  }
}
