import { extendType, intArg, list, nonNull } from "nexus";
import { Octokit } from "@octokit/rest";
import { Repository } from "./model";


export const IntegrationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getRepositories", {
      type: "RepositoryResponse",
      resolve: async (_, __, { prisma, user }) => {
        if (!user) {
          throw new Error("Unauthorized");
        }
        
        const githubIntegration = await prisma.integration.findFirst({
          where: {
            userId: user.id,
            provider: "github"
          },
        });

        if (!githubIntegration) {
          return {
            status: "disconnected",
            repositories: [],
            message: "Connect your GitHub account to view your repositories"
          };
        }

        const octokit = new Octokit({
          auth: githubIntegration.accessToken,
        });
        
        try {
          const { data: repos } = await octokit.repos.listForAuthenticatedUser({
            per_page: 100,
          });
          // Sort repositories by pushed_at in descending order (most recent first)
          const sortedRepos = repos.sort((a, b) => 
            new Date(b.pushed_at || b.created_at || "").getTime() - new Date(a.pushed_at || a.created_at || "").getTime()
          );
          
          return {  
            status: "connected",
            repositories: sortedRepos.map((repo: Repository) => ({
              id: repo.id,
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              url: repo.html_url,
              private: repo.private,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              pushedAt: repo.pushed_at || repo.created_at || "",
              branches: [],
              commits: [],
              contributors: [],
            })),
            message: `Found ${repos.length} repositories`
          };
        } catch (error) {
          console.error(`Error fetching GitHub repos: ${error}`);
          return {
            status: "error",
            repositories: [],
            message: "Failed to fetch repositories. Please try reconnecting your GitHub account."
          };
        }
      },
    });
  },
});


export const RepositoryQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getRepositoryDetailsById", {
      type: "GitHubRepository",
      args: {
        repoId: nonNull(intArg()),
      },
      resolve: async (_, { repoId }, { prisma, user }) => {
        if (!user) throw new Error("Unauthorized");

        const githubIntegration = await prisma.integration.findFirst({
          where: {
            userId: user.id,
            provider: "github",
          },
        });

        if (!githubIntegration) throw new Error("GitHub account not connected");

        const octokit = new Octokit({ auth: githubIntegration.accessToken });

        try {
          // Step 1: Get repo by ID
          const { data: repo } = await octokit.request("GET /repositories/{repo_id}", {
            repo_id: repoId,
          });

          // Step 2: Fetch details using owner + name
          const [branches, commits, contributors] = await Promise.all([
            octokit.repos.listBranches({ owner: repo.owner.login, repo: repo.name }),
            octokit.repos.listCommits({ owner: repo.owner.login, repo: repo.name, per_page: 10 }),
            octokit.repos.listContributors({ owner: repo.owner.login, repo: repo.name }),
          ]);

          console.log("detailed resp")
          // console.log(branches.data);
          console.log(JSON.stringify(commits.data[0].commit) );
          // console.log(contributors.data);

          return {
            id: repo.id.toString(),
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            private: repo.private,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            pushedAt: repo.pushed_at || repo.created_at || "",
            branches: branches.data.map(b => b.name),
            commits: commits.data.map(c => ({
              sha: c.sha,
              message: c.commit.message,
              url: c.html_url,
              comment_count: c.commit.comment_count,
              committer: c.commit.committer || null,
            })),
            contributors: contributors.data.map(c => ({
              login: c.login,
              avatar_url: c.avatar_url,
            })),
          };
        } catch (error) {
          console.error("Error fetching repository by ID:", error);
          throw new Error("Failed to fetch repository details.");
        }
      },
    });
  },
});