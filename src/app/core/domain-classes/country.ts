import { City } from "./cities";

export class Country {
    id: string;
    name: string;
    countryRecord:CountryRecord[]
}


export class CountryRecord {
    id?: string;
    countryId?:string;
    name?: string;
    languageCode?:string;
    cities:City[]
}

