import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);
  private readonly BASE_URL = 'https://production.cas.so/address-kit/latest';

  // Constructor with HttpService and CacheManager injection
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Get provinces with caching
  async getProvinces() {
    const cacheKey = 'provinces';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.BASE_URL}/provinces`),
      );

      // Extract provinces array from response
      const data = response.data.provinces || response.data;

      await this.cacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch provinces', error);
      throw new Error('Failed to fetch provinces');
    }
  }

  // Get communes by province code with caching
  async getCommunes(provinceCode: string) {
    const cacheKey = `communes_${provinceCode}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.BASE_URL}/provinces/${provinceCode}/communes`,
        ),
      );

      // Extract communes array from response
      const data = response.data.communes || response.data;

      await this.cacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch communes for province ${provinceCode}`,
        error,
      );
      throw new Error('Failed to fetch communes');
    }
  }
}
