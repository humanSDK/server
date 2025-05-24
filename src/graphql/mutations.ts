import { gql } from "@apollo/client"

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, password: $password) {
      id
      name
      email
    }
  }
`

export const CREATE_CLOUD_INTEGRATION = gql`
mutation CreateCloudIntegration($provider: CloudProvider!, $aws: AWSIntegrationInput) {
  createCloudIntegration(provider: $provider, aws: $aws) {
    id
    provider
  }
}
`
