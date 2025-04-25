export interface Tenant {
    id: number;
    firstname: string;
    surname: string;
    date_of_birth: string; 
    phone: string;
    email: string;
    description: string;
    address_id: number | null;
    user_id: number | null;
    date_created: Date; 
    date_updated: Date; 
    version: number;
}