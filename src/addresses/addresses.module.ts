import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      ttl: 86400000, // 24 hours
      max: 100,
    }),
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
