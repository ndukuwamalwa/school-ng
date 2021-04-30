import { gql } from 'apollo-angular';

export const GET_ROLES_QUERY = gql`{
    getSystemRoles {
      id
      name
      createdOn
      createdBy
      accessAreasCount
      accessPercentage
      userCount
    }
  }`;
