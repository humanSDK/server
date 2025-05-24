import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
  query GetRepositories {
    getRepositories {
      status
      message
      repositories {
        id
        name
        fullName
        description
        url
        private
        stars
        forks
        pushedAt
      }
    }
  }
`;