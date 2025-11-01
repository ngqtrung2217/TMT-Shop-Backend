import { HttpService } from '@nestjs/axios';
import type { Cache } from 'cache-manager';
export declare class AddressesService {
    private readonly httpService;
    private cacheManager;
    private readonly logger;
    private readonly BASE_URL;
    constructor(httpService: HttpService, cacheManager: Cache);
    getProvinces(): Promise<any>;
    getCommunes(provinceCode: string): Promise<any>;
}
