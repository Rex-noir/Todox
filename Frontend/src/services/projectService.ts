import api from "@/api";
import { ApiResponse, Project } from "@/interfaces/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addProject,
  deleteProject,
  updateProject,
} from "@/stores/todox/actions";
import { AxiosResponse } from "axios";

export const projectServices = {
  delete: (id: string) => api.delete(`/projects/${id}`),
  getAll: (): Promise<AxiosResponse<ApiResponse<Project[]>>> =>
    api.get("/projects"),
  getById: (id: string): Promise<Project> => api.get(`/projects/${id}`),
  update: (id: string, project: Partial<Project>) =>
    api.put(`/projects/${id}`, project),
  create: (
    project: Partial<Project>,
  ): Promise<AxiosResponse<ApiResponse<Project>>> =>
    api.post("/projects", project),
};

export const useDeleteProject = (id: string) => {
  return useMutation({
    mutationFn: () => projectServices.delete(id),
    onSuccess: () => {
      deleteProject(id);
    },
  });
};

export const useGetAllProjects = (enabled: boolean) => {
  return useQuery({
    queryFn: projectServices.getAll,
    queryKey: ["projects"],
    retry: false,
    enabled: enabled,
    select:(data)=>{
      return data.data.data;
    }
  });
};

export const useGetProject = (id: string) => {
  return useQuery({
    queryFn: () => projectServices.getById(id),
    queryKey: ["project", id],
    retry: false,
  });
};

export const useUpdateProject = (id: string, project: Partial<Project>) => {
  return useMutation({
    mutationFn: () => projectServices.update(id, project),
    onSuccess: () => {
      updateProject(id, project);
    },
  });
};

export const useCreateProject = (project: Partial<Project>) => {
  return useMutation({
    mutationFn: () => projectServices.create(project),
    onSuccess: (data) => {
      addProject(data.data.data);
    },
  });
};
