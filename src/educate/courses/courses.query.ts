import { gql } from 'apollo-angular';

export const GET_COURSES_QUERY = (department?: number) => gql`{
    courses(department: ${department ? department : null}) {
        id
        name
        code
        department
        duration
        durationIn,
        journeys {
            id
            course
            level
            terms
        }
    }
}`;
