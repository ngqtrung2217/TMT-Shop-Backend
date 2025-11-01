"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AddressesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const cache_manager_1 = require("@nestjs/cache-manager");
const rxjs_1 = require("rxjs");
let AddressesService = AddressesService_1 = class AddressesService {
    httpService;
    cacheManager;
    logger = new common_1.Logger(AddressesService_1.name);
    BASE_URL = 'https://production.cas.so/address-kit/latest';
    constructor(httpService, cacheManager) {
        this.httpService = httpService;
        this.cacheManager = cacheManager;
    }
    async getProvinces() {
        const cacheKey = 'provinces';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.BASE_URL}/provinces`));
            const data = response.data.provinces || response.data;
            await this.cacheManager.set(cacheKey, data);
            return data;
        }
        catch (error) {
            this.logger.error('Failed to fetch provinces', error);
            throw new Error('Failed to fetch provinces');
        }
    }
    async getCommunes(provinceCode) {
        const cacheKey = `communes_${provinceCode}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.BASE_URL}/provinces/${provinceCode}/communes`));
            const data = response.data.communes || response.data;
            await this.cacheManager.set(cacheKey, data);
            return data;
        }
        catch (error) {
            this.logger.error(`Failed to fetch communes for province ${provinceCode}`, error);
            throw new Error('Failed to fetch communes');
        }
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = AddressesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [axios_1.HttpService, Object])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map