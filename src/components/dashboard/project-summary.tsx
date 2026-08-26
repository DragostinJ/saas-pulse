import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManageProjectButton } from "@/components/dashboard/manage-project-button";

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export interface ProjectData {
  readonly id: string;
  name: string;
  status: ProjectStatus;
  budget: number;
}

async function getProjectData(): Promise<ProjectData> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return {
    id: "proj_73829",
    name: "Q3 Marketing Site Refactor",
    status: "ACTIVE",
    budget: 15000,
  };
}

export async function ProjectSummary() {
  const project = await getProjectData();

  return (
    <Card className="w-full max-w-md bg-card text-card-foreground border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <Badge variant={project.status === "ACTIVE" ? "default" : "secondary"}>
            {project.status}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          Project ID: {project.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-muted-foreground">Allocated Budget</span>
          <span className="text-3xl font-extrabold tracking-tight">
            ${project.budget.toLocaleString()}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <ManageProjectButton projectId={project.id} />
      </CardFooter>
    </Card>
  );
}