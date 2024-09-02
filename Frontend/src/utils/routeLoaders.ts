import api from "@/api";
import { defer } from "react-router-dom";

export const authRequired = () => {
  const getUser = api.get("/user");
  const getProjects = api.get("/projects");
  const getTodoLists = api.get("/todolists");
  const getTodos = api.get("/todos");

  return defer({
    values: Promise.all([getUser, getProjects, getTodoLists, getTodos]),
  });
};
