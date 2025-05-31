import { trpc } from "@/app/_trpc/client";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const {
    data: projects,
    isLoading,
    error,
  } = trpc.project.getProjects.useQuery();
  const [projectId, setProjectId] = useLocalStorage("projectId", " ");
  const project = projects?.find((project) => project.id === projectId);
  console.log(projects);

  return {
    projects,
    project,
    projectId,
    setProjectId,
    isLoading,
    error,
  };
};

export default useProject;
