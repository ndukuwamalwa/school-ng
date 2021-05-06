import { gql } from 'apollo-angular';

export const GET_SELECTABLE_EMPLOYEES_QUERY = gql`{
    employees {
        staffNo
        firstname
        lastname
        phone
        idNo
    }
}`;

export const GET_EMPLOYEES = (id?: number) => gql`{
    employees(department: ${id}) {
        id
        staffNo
        firstname
        lastname
        othernames
        dob
        gender
        email
        phone
        idType
        idNo
        town
        address
        kraPIN
        nssf
        nhif
        bankBranch
        accNo
        nextOfKin
        nextOfKinPhone
        nextOfKinIdType
        nextOfKinId
        hireDate
        educationLevel
        almaMata
        graduationDate
        title
        jobTitle
        department
    }
}`;
