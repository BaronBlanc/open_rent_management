export interface PropertyManager {
    id: number;
    email: string;
    address_id: number | null;
    user_id: number | null;
    date_updated: Date;
    surname: string;
    firstname: string;
    title: string;
    phone_number: string;
    date_created: Date;
    version: number;
}