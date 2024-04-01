export class City {
    id?: string;
    name?: string;
    serviceCityId?:string;
    cografiKibleAcisi?:string;
    kabeyeUzaklik?:string;
    kibleAcisi?:string;
    slug?:string;
    cityRecords:CityRecord[]
}

export class CityRecord {
    id?: string;
    cityId?:string;
    name?: string;
    languageCode?:string;
}

export class State{
    id?: string;
    name?: string;
}