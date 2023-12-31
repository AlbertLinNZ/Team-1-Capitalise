import { TNewProject } from "../model/TNewProject";
import { API_URL } from "./config";

export async function createProject(newProject: TNewProject, token: string) {
  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "x-auth-token": token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: newProject.name,
      teamname: newProject.teamname,
      semester: newProject.semester,
      category: newProject.category,
      links: newProject.links,
      banner: newProject.banner,
      thumbnail: newProject.thumbnail,
      content: newProject.content,
      tags: newProject.tags,
    }),
  });
  return response.json();
}
