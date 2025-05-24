import { extendType, list } from "nexus";
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