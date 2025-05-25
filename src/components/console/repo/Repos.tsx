import { useQuery } from "@apollo/client";
import { GET_REPOSITORIES } from "@/graphql/queries";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Github, Lock, Star, GitFork, AlertCircle, Clock, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTimeAgo } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  private: boolean;
  stars: number;
  forks: number;
  pushedAt: string;
}

interface RepositoryResponse {
  status: "connected" | "disconnected" | "error";
  message: string;
  repositories: Repository[];
}

const REPOS_PER_PAGE = 36;

type VisibilityFilter = "all" | "public" | "private";

export const Repos = () => {
  const [visibleRepos, setVisibleRepos] = useState(REPOS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const { data, loading, error } = useQuery(GET_REPOSITORIES);
  const router = useRouter();

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load repositories. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  const response = data?.getRepositories as RepositoryResponse | undefined;
  const repositories = response?.repositories || [];

  const filteredRepositories = useMemo(() => {
    return repositories.filter(repo => {
      const matchesSearch = searchQuery === "" || 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.url.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesVisibility = visibilityFilter === "all" || 
        (visibilityFilter === "private" && repo.private) ||
        (visibilityFilter === "public" && !repo.private);

      return matchesSearch && matchesVisibility;
    });
  }, [repositories, searchQuery, visibilityFilter]);

  const hasMore = filteredRepositories.length > visibleRepos;

  const loadMore = () => {
    setVisibleRepos(prev => prev + REPOS_PER_PAGE);
  };

  const connectGithub = async () => {
    const response = await fetch("/api/integrations/github/authorize");
    const data = await response.json();
    window.location.href = data.url;
  }

  const handleRepoClick = (repoId: string) => {
    router.push(`/console/repos/preview/${repoId}`);
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Card key={i} className="h-[200px]">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (response?.status === "disconnected") {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Github className="h-6 w-6" />
              <CardTitle>Connect Your GitHub Account</CardTitle>
            </div>
            <CardDescription>
              {response.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              By connecting your GitHub account, you'll be able to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>View all your repositories in one place</li>
              <li>See repository statistics and details</li>
              <li>Access your private repositories</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={connectGithub}>
              Connect GitHub Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (response?.status === "error") {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>{response.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {response?.message && (
          <p className="text-sm text-muted-foreground">{response.message}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={visibilityFilter}
            onValueChange={(value) => setVisibilityFilter(value as VisibilityFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Repositories</SelectItem>
              <SelectItem value="public">Public Only</SelectItem>
              <SelectItem value="private">Private Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRepositories.slice(0, visibleRepos).map((repo: Repository) => (
          <Card key={repo.id} onClick={() => handleRepoClick(repo.id.toString())} className="flex flex-col hover:border-primary/30 hover:mx-1 transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <CardTitle className="text-lg">{repo.name}</CardTitle>
                {repo.private && <Lock className="h-4 w-4" />}
              </div>
              <CardDescription className="line-clamp-2">
                {repo.description || "No description available"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {repo.fullName}
              </a>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{getTimeAgo(repo.pushedAt)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{repo.forks}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button onClick={loadMore} variant="outline">
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};