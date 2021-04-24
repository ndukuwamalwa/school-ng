export interface NameValue {
    name: string;
    value: any;
}

export interface User {
    active: boolean;
    approved: boolean;
    approvedBy: string;
    approvedOn: string;
    createdBy: string;
    createdOn: number;
    deleted: string;
    password: string;
    reset: boolean;
    role: string;
    staffNo: string;
    username: string;
}

export interface Role {
    name: string;
    createdOn: string;
    createdBy: string;
    accessAreasCount: number;
    accessPercentage: number;
    userCount: number;
}
