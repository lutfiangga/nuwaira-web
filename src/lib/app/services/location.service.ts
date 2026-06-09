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

export interface Village {
	id: string;
	district_id: string;
	name: string;
}

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export class LocationService {
	private static async get<T>(path: string): Promise<T[]> {
		try {
			const response = await fetch(`${BASE_URL}/${path}`, {
				headers: { accept: 'application/json' }
			});

			if (!response.ok) {
				throw new Error(`Emsifa responded with ${response.status}`);
			}

			const data: unknown = await response.json();
			return Array.isArray(data) ? (data as T[]) : [];
		} catch (error) {
			console.error(`Failed to fetch Emsifa location data (${path}):`, error);
			return [];
		}
	}

	/**
	 * Mengambil daftar semua provinsi di Indonesia.
	 * Menggunakan API eksternal.
	 * @returns Promise<Province[]>
	 */
	static async getProvinces(): Promise<Province[]> {
		return this.get<Province>('provinces.json');
	}

	/**
	 * Mengambil daftar kota/kabupaten berdasarkan ID provinsi.
	 * @param provinceId ID Provinsi
	 * @returns Promise<City[]>
	 */
	static async getCities(provinceId: string): Promise<City[]> {
		return this.get<City>(`regencies/${provinceId}.json`);
	}

	/**
	 * Mengambil daftar kecamatan berdasarkan ID kota/kabupaten.
	 * @param cityId ID Kota/Kabupaten
	 * @returns Promise<District[]>
	 */
	static async getDistricts(cityId: string): Promise<District[]> {
		return this.get<District>(`districts/${cityId}.json`);
	}

	static async getVillages(districtId: string): Promise<Village[]> {
		return this.get<Village>(`villages/${districtId}.json`);
	}
}
