import { Project, TimeEntry } from "@/types";

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(project: Omit<Project, "id">): Promise<Project>;
  update(id: string, project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}

export interface ITimeEntryRepository {
  getAll(): Promise<TimeEntry[]>;
  getByProjectId(projectId: string): Promise<TimeEntry[]>;
  create(entry: Omit<TimeEntry, "id">): Promise<TimeEntry>;
  update(id: string, entry: Partial<TimeEntry>): Promise<TimeEntry>;
  delete(id: string): Promise<void>;
}
