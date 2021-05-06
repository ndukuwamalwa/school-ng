import { gql } from 'apollo-angular';

export const GET_BANKS_QUERY = gql`{
    banks {
        id
        shortDesc
        description
        createdOn
    }
}`;

export const GET_BANK_BRANCHES = (bank: number) => gql`{
    bankBranches(bank: ${bank}) {
        id
        town
        bank
        address
        contact
    }
}`;

export const GET_BANK_WITH_BRANCHES = gql`{
    banks {
        id
        shortDesc
        description
        createdOn
        branches {
            id
            town
            bank
            address
            contact
        }
    }
}`;
