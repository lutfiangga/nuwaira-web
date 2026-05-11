// Simple location service using Indonesia regions data
// Using free API: https://www.emsifa.com/api-wilayah-indonesia/

export interface Province {
    id: string;
    name: string;
}

export interface City {
    id: string;
    province_id: string;
    name: string;
}

export interface District {
    id: string;
    regency_id: string;
    name: string;
}

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export class LocationService {

    /**
     * Mengambil daftar semua provinsi di Indonesia.
     * Menggunakan API eksternal.
     * @returns Promise<Province[]>
     */
    static async getProvinces(): Promise<Province[]> {
        try {
            const response = await fetch(`${BASE_URL}/provinces.json`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch provinces:', error);
            return [];
        }
    }

    /**
     * Mengambil daftar kota/kabupaten berdasarkan ID provinsi.
     * @param provinceId ID Provinsi
     * @returns Promise<City[]>
     */
    static async getCities(provinceId: string): Promise<City[]> {
        try {
            const response = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            return [];
        }
    }

    /**
     * Mengambil daftar kecamatan berdasarkan ID kota/kabupaten.
     * @param cityId ID Kota/Kabupaten
     * @returns Promise<District[]>
     */
    static async getDistricts(cityId: string): Promise<District[]> {
        try {
            const response = await fetch(`${BASE_URL}/districts/${cityId}.json`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch districts:', error);
            return [];
        }
    }
}
