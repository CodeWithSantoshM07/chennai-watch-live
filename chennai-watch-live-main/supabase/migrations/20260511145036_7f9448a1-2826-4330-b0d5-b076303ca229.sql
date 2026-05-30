
CREATE TABLE public.incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  severity text NOT NULL,
  description text NOT NULL DEFAULT '',
  area text NOT NULL,
  lat double precision NOT NULL,
  lon double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "incidents_read_all" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "incidents_insert_all" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE INDEX incidents_created_at_idx ON public.incidents (created_at DESC);
