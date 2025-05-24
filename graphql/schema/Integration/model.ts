import { objectType } from "nexus"
import * as np from "nexus-prisma";


  export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  created_at: string | null;
}

export const Integration = objectType({
  name:np.Integration.$name,
  definition(t) {
    t.field(np.Integration.id)
    t.field(np.Integration.provider)
    t.field(np.Integration.providerUserId)
    t.field(np.Integration.accessToken)
    t.field(np.Integration.connectedAt)
    t.field(np.Integration.userId)
  },
})

export const GitHubRepository = objectType({
  name: "GitHubRepository",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("name")
    t.nonNull.string("fullName")
    t.string("description")
    t.nonNull.string("url")
    t.nonNull.boolean("private")
    t.nonNull.int("stars")
    t.nonNull.int("forks")
    t.nonNull.string("pushedAt")
  },
})

export const RepositoryResponse = objectType({
  name: "RepositoryResponse",
  definition(t) {
    t.nonNull.string("status")
    t.list.field("repositories", { type: "GitHubRepository" })
    t.string("message")
  },
})