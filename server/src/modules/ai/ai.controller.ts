import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('search')
  @ApiOperation({ summary: 'Search venues using natural language' })
  @ApiResponse({ status: 200, description: 'Matching venues' })
  async search(@Body() body: { query: string }) {
    return this.aiService.searchByNaturalLanguage(body.query);
  }
}
