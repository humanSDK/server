"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_REPOSITORY_DETAILS_BY_ID } from "@/graphql/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Github, Star, GitFork, Clock, Users, GitBranch, GitCommit } from "lucide-react";
import { getTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RepoPreviewPage() {
  const params = useParams<{ repoId: string }>(); 
  
  const { data, loading, error } = useQuery(GET_REPOSITORY_DETAILS_BY_ID, {
    variables: { repoId: parseInt(params?.repoId || "0") },
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const repo = data.getRepositoryDetailsById;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Github className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{repo.name}</h1>
          {repo.private && <Badge variant="secondary">Private</Badge>}
        </div>
        <p className="text-muted-foreground">{repo.description || "No description available"}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{repo.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Updated {getTimeAgo(repo.pushedAt)}</span>
          </div>
        </div>
      </div>

      {/* Repository Information */}
      <Card>
        <CardHeader>
          <CardTitle>Repository Information</CardTitle>
          <CardDescription>Details about this repository</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">{repo.fullName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">URL</p>
                <a 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {repo.url}
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contributors 
              </p>
              <div className="flex flex-wrap gap-2">
                {repo.contributors?.map((contributor: any, index: number) => (
                  <div key={index} className="relative group">
                    <Avatar className="h-8 w-8 border-2 border-background hover:border-primary transition-colors">
                      <AvatarImage 
                        src={contributor.avatar_url} 
                        alt={contributor.login}
                      />
                      <AvatarFallback className="text-xs">
                        {contributor.login.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {contributor.login}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Commits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Recent Commits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {repo.commits?.map((commit: any, index: number) => (
              <div key={index} className="flex flex-col p-3 rounded-lg hover:bg-muted">
                <div className="flex items-center justify-between">
                  <a 
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-blue-500 hover:underline"
                  >
                    {commit.sha.substring(0, 7)}
                  </a>
                  <span className="text-xs text-muted-foreground">
                    {commit.committer?.date ? getTimeAgo(commit.committer.date) : 'Unknown date'}
                  </span>
                </div>
                <p className="text-sm mt-1">{commit.message}</p>
                {commit.committer && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{commit.committer.name}</span>
                    {commit.committer.email && (
                      <span className="text-muted-foreground/70">({commit.committer.email})</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Branches Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {repo.branches?.map((branch: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                <span className="text-sm">{branch}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}