import { Controller, Get, Param } from '@nestjs/common';

@Controller('folders')
export class ReadItemsController {
  @Get(':id')
  getItemById(@Param('id') id: string) {}
}
