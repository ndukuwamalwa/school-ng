import { gql } from 'apollo-angular';

export const GET_DEPARTMENTS_QUERY = gql`{
    departments {
        id
        name
        hod
        contact
        motto
    }
}`;
