import { AddressesService } from './addresses.service';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    getProvinces(): Promise<any>;
    getCommunes(provinceCode: string): Promise<any>;
}
