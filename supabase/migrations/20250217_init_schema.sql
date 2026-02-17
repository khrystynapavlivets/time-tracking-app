-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    client TEXT,
    color TEXT,
    hex_color TEXT,
    total_hours NUMERIC DEFAULT 0,
    status TEXT CHECK (status IN ('Active', 'Completed', 'On Hold')) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create time_entries table
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task TEXT NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    duration INTEGER DEFAULT 0,
    start_time TEXT,
    end_time TEXT,
    date DATE DEFAULT CURRENT_DATE,
    billable BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- Create policies (open for now as auth is not integrated in UI)
-- Note: In production, these should be restricted to authenticated users or specific roles.
CREATE POLICY "Enable read access for all users" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.time_entries FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.time_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.time_entries FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.time_entries FOR DELETE USING (true);
