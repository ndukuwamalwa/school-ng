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
    roleName: string;
}

export interface Role {
    id: number;
    name: string;
    createdOn: string;
    createdBy: string;
    accessAreasCount: number;
    accessPercentage: number;
    userCount: number;
}

export interface ApplicationProcess {
    appModule: string;
    shortDesc: string;
    description: string;
    checked: boolean;
    disabled: boolean;
}

export interface ApplicationModule {
    shortDesc: string;
    description: string;
    processes: Array<ApplicationProcess>;
    checked: boolean;
    disabled?: boolean;
}
