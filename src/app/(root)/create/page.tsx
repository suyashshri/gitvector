"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

type inputFormType = {
  projectName: string;
  githubUrl: string;
  githubToken?: string;
};

const Page = () => {
  const { register, handleSubmit } = useForm<inputFormType>();

  function onSubmit(data: inputFormType) {
    console.log(data);
    return true;
  }
  return (
    <div>
      <div className="flex items-center gap-12 h-full justify-center m-auto mt-[40%]">
        <Image src="/git.avif" alt="create_image" width={280} height={280} />
        <div className="">
          <div className="">
            <h1 className="font-semibold text-2xl">
              Link your GitHub Repository
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the URL of the repo you want to link.
            </p>
          </div>
          <div className="h-4"></div>
          <div className="">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <Input
                {...register("projectName", { required: true })}
                placeholder="ProjectName"
              />
              <Input
                {...register("githubUrl", { required: true })}
                placeholder="Enter Github Url"
              />
              <Input
                {...register("githubToken")}
                placeholder="Github Token (Optional)"
              />
              <Button type="submit" className="w-fit ">
                Create Project
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
