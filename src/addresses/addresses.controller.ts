import { Controller, Get, Query } from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get('provinces')
  getProvinces() {
    return this.addressesService.getProvinces();
  }

  @Get('communes')
  getCommunes(@Query('province') provinceCode: string) {
    if (!provinceCode) {
      throw new Error('Province code is required');
    }
    return this.addressesService.getCommunes(provinceCode);
  }
}
