"use client";
import useProject from "@/hooks/use-project";
import { ExternalLink, GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { project, isLoading, error } = useProject();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        <div className=" w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <GithubIcon className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project is linked to{" "}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLink className="ml-2 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="h-4"></div>

        <div className="">TM Invite Archive</div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          AskQuestionCard
        </div>
      </div>

      <div className="mt-8"></div>
    </div>
  );
}
