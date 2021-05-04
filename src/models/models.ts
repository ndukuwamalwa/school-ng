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

export interface EmployeeLeaveDtls {
    id: number;
    startOn: string;
    endOn: string;
    requestedOn: string;
}

export interface EmployeeLeave {
    id: string;
    year: number;
    totalDays: number;
    daysUsed: number;
    dtls: Array<EmployeeLeaveDtls>;
}

export interface Employee {
    id: number;
    staffNo: string;
    firstname: string;
    lastname: string;
    othernames: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    idType: string;
    idNo: string;
    town: string;
    address: string;
    kraPIN: string;
    nssf: string;
    nhif: string;
    bankBranch: number;
    accNo: string;
    nextOfKin: string;
    nextOfKinPhone: string;
    nextOfKinIdType: string;
    nextOfKinId: string;
    hireDate: string;
    educationLevel: string;
    almaMata: string;
    graduationDate: string;
    title: string;
    jobTitle: string;
    department: number;
    leaves: Array<EmployeeLeave>;
}

export interface Student {
    id: number;
    adm: string;
    firstname: string;
    lastname: string;
    othernames: string;
    dob: string;
    gender: string;
    parent: number;
    relation: string;
    email: string;
    phone: string;
    admitted: string;
    idType: string;
    idNo: string;
    religion: string;
    town: string;
    address: string;
    journey: number;
    status: string;
}

export interface CourseSubject {
    id: number;
    course: number;
    journey: number;
    name: string;
    core: boolean;
    passMark: number;
    failMark: number;
    ordinaryGrading: boolean;
}

export interface CourseJourney {
    id: number;
    course: number;
    level: number;
    terms: number;
    students: Array<Student>;
    subjects: Array<CourseSubject>;
}

export interface CourseStudent {
    id: number;
    course: number;
    journey: number;
    student: number;
    year: number;
    period: string;
    coreSubjects: number;
    optionalSubjects: number;
    startedOn: string;
    completedOn: string;
}

export interface Course {
    id: string;
    name: string;
    code: string;
    description: string;
    department: number;
    duration: number;
    durationIn: string;
    journeys: Array<CourseJourney>;
    students: Array<CourseStudent>;
    subjects: Array<CourseSubject>;
}

export interface Department {
    id: number;
    name: string;
    hod: number;
    hodName: string;
    contact: string;
    motto: string;
    employees: Array<Employee>;
    courses: Array<Course>;
}
