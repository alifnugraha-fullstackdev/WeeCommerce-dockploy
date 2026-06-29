-- Call bookings table for discovery call scheduling
CREATE TABLE IF NOT EXISTS call_bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(30) NOT NULL,
  date        DATE NOT NULL,
  time_slot   VARCHAR(5) NOT NULL, -- "09:00"
  note        TEXT,
  status      VARCHAR(20) DEFAULT 'confirmed'
              CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_date ON call_bookings(date, time_slot);
CREATE INDEX idx_bookings_email ON call_bookings(email);
CREATE INDEX idx_bookings_status ON call_bookings(status);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON call_bookings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
