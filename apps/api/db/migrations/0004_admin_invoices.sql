-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number  VARCHAR(20) UNIQUE NOT NULL,
  client_name     VARCHAR(255) NOT NULL,
  client_email    VARCHAR(255) NOT NULL,
  client_phone    VARCHAR(30),
  project_name    VARCHAR(255) NOT NULL,
  service_tier    VARCHAR(20),
  amount_idr      BIGINT NOT NULL,
  amount_usd      INT,
  currency        VARCHAR(3) DEFAULT 'IDR',
  status          VARCHAR(20) DEFAULT 'draft'
                  CHECK (status IN ('draft', 'sent', 'paid_kickoff', 'paid_staging', 'paid_final', 'cancelled')),
  milestone       VARCHAR(20) DEFAULT 'kickoff'
                  CHECK (milestone IN ('kickoff', 'staging', 'final')),
  notes           TEXT,
  sent_at         TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  due_at          TIMESTAMPTZ,
  created_by      UUID REFERENCES admin_users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_client_email ON invoices(client_email);

-- Invoice items (line items)
CREATE TABLE IF NOT EXISTS invoice_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(500) NOT NULL,
  amount_idr  BIGINT NOT NULL,
  amount_usd  INT,
  sort_order  INT DEFAULT 0
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
