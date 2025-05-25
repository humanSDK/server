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


export const GET_CLOUD_INTEGRATIONS = gql`
query GetCloudIntegrations {
  getCloudIntegrations {
    id
    provider
    awsId
    gcpId
    azureId
  }
}
`


export const GET_REPOSITORY_DETAILS_BY_ID = gql`
query GetRepositoryDetailsById($repoId: Int!) {
  getRepositoryDetailsById(repoId: $repoId) {
    id
    name
    fullName
    description
    url
    private
    stars
    forks
    pushedAt
    branches
    commits {
      sha
      message
      url
      comment_count
      committer {
        name
        date
      }
    }
    contributors {
      login
      avatar_url
    }
  }
}
`