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

export const GET_APPLICATION_MODULES_QUERY = gql`{
  getApplicationModules {
    shortDesc
    description
    processes {
      shortDesc
      description
    }
  }
}`;

export const GET_ROLE_PROCESS_AREAS = (role: number) => gql`{
  getRoleProcessAreas(role: ${role}) {
    shortDesc
    description
    appModule
  }
}`;

export const GET_ROLE_USERS_QUERY = (role: number) => gql`{
  getRoleUsers(role: ${role}) {
    username
    createdBy
    staffNo
  }
}`;

export const GET_USERS_QUERY = gql`{
  users {
    active
    approved
    approvedBy
    approvedOn
    createdBy
    createdOn
    deleted
    password
    reset
    role
    staffNo
    username
  }
}`;
