import { SupabaseClient } from "@supabase/supabase-js";
import { ITimeEntryRepository } from "./types";
import { TimeEntry } from "@/types";

export class SupabaseTimeEntryRepository implements ITimeEntryRepository {
  constructor(private supabase: SupabaseClient) {}

  async getAll(): Promise<TimeEntry[]> {
    const { data, error } = await this.supabase
      .from("time_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((e) => ({
      id: e.id,
      task: e.task,
      projectId: e.project_id,
      duration: e.duration,
      startTime: e.start_time,
      endTime: e.end_time,
      date: e.date,
      billable: e.billable,
    }));
  }

  async getByProjectId(projectId: string): Promise<TimeEntry[]> {
    const { data, error } = await this.supabase
      .from("time_entries")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((e) => ({
      id: e.id,
      task: e.task,
      projectId: e.project_id,
      duration: e.duration,
      startTime: e.start_time,
      endTime: e.end_time,
      date: e.date,
      billable: e.billable,
    }));
  }

  async create(entry: Omit<TimeEntry, "id">): Promise<TimeEntry> {
    const { data, error } = await this.supabase
      .from("time_entries")
      .insert({
        task: entry.task,
        project_id: entry.projectId,
        duration: entry.duration,
        start_time: entry.startTime,
        end_time: entry.endTime,
        date: entry.date,
        billable: entry.billable,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      task: data.task,
      projectId: data.project_id,
      duration: data.duration,
      startTime: data.start_time,
      endTime: data.end_time,
      date: data.date,
      billable: data.billable,
    };
  }

  async update(id: string, entry: Partial<TimeEntry>): Promise<TimeEntry> {
    const updates: Record<string, unknown> = {};
    if (entry.task !== undefined) updates.task = entry.task;
    if (entry.projectId !== undefined) updates.project_id = entry.projectId;
    if (entry.duration !== undefined) updates.duration = entry.duration;
    if (entry.startTime !== undefined) updates.start_time = entry.startTime;
    if (entry.endTime !== undefined) updates.end_time = entry.endTime;
    if (entry.date !== undefined) updates.date = entry.date;
    if (entry.billable !== undefined) updates.billable = entry.billable;

    const { data, error } = await this.supabase
      .from("time_entries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      task: data.task,
      projectId: data.project_id,
      duration: data.duration,
      startTime: data.start_time,
      endTime: data.end_time,
      date: data.date,
      billable: data.billable,
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("time_entries").delete().eq("id", id);
    if (error) throw error;
  }
}
