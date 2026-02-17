-- Function to update project total hours
CREATE OR REPLACE FUNCTION update_project_total_hours()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects
    SET total_hours = (
      SELECT COALESCE(SUM(duration), 0)::numeric / 3600
      FROM public.time_entries
      WHERE project_id = NEW.project_id
    )
    WHERE id = NEW.project_id;
  
  -- Handle DELETE
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects
    SET total_hours = (
      SELECT COALESCE(SUM(duration), 0)::numeric / 3600
      FROM public.time_entries
      WHERE project_id = OLD.project_id
    )
    WHERE id = OLD.project_id;
  
  -- Handle UPDATE
  ELSIF TG_OP = 'UPDATE' THEN
    -- If project_id changed, update both old and new projects
    IF NEW.project_id IS DISTINCT FROM OLD.project_id THEN
      -- Update old project
      UPDATE public.projects
      SET total_hours = (
        SELECT COALESCE(SUM(duration), 0)::numeric / 3600
        FROM public.time_entries
        WHERE project_id = OLD.project_id
      )
      WHERE id = OLD.project_id;
      
      -- Update new project
      UPDATE public.projects
      SET total_hours = (
        SELECT COALESCE(SUM(duration), 0)::numeric / 3600
        FROM public.time_entries
        WHERE project_id = NEW.project_id
      )
      WHERE id = NEW.project_id;
    ELSE
      -- Just update the current project (in case duration changed)
      UPDATE public.projects
      SET total_hours = (
        SELECT COALESCE(SUM(duration), 0)::numeric / 3600
        FROM public.time_entries
        WHERE project_id = NEW.project_id
      )
      WHERE id = NEW.project_id;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger
DROP TRIGGER IF EXISTS update_project_hours_trigger ON public.time_entries;
CREATE TRIGGER update_project_hours_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.time_entries
FOR EACH ROW
EXECUTE FUNCTION update_project_total_hours();
