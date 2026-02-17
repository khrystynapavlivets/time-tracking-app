import { SupabaseClient } from "@supabase/supabase-js";
import { IProjectRepository } from "./types";
import { Project } from "@/types";

export class SupabaseProjectRepository implements IProjectRepository {
  constructor(private supabase: SupabaseClient) {}

  async getAll(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      client: p.client,
      color: p.color,
      hexColor: p.hex_color,
      totalHours: Number(p.total_hours),
      status: p.status,
    }));
  }

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      name: data.name,
      client: data.client,
      color: data.color,
      hexColor: data.hex_color,
      totalHours: Number(data.total_hours),
      status: data.status,
    };
  }

  async create(project: Omit<Project, "id">): Promise<Project> {
    const { data, error } = await this.supabase
      .from("projects")
      .insert({
        name: project.name,
        client: project.client,
        color: project.color,
        hex_color: project.hexColor,
        total_hours: project.totalHours,
        status: project.status,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      client: data.client,
      color: data.color,
      hexColor: data.hex_color,
      totalHours: Number(data.total_hours),
      status: data.status,
    };
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const updates: Record<string, unknown> = {};
    if (project.name !== undefined) updates.name = project.name;
    if (project.client !== undefined) updates.client = project.client;
    if (project.color !== undefined) updates.color = project.color;
    if (project.hexColor !== undefined) updates.hex_color = project.hexColor;
    if (project.totalHours !== undefined) updates.total_hours = project.totalHours;
    if (project.status !== undefined) updates.status = project.status;

    const { data, error } = await this.supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      client: data.client,
      color: data.color,
      hexColor: data.hex_color,
      totalHours: Number(data.total_hours),
      status: data.status,
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  }
}
