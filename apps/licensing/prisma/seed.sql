-- Catalog data with stable keys (licensing ADR 0002). Keys are added, never renamed or reused.
INSERT INTO "Role" ("key") VALUES ('company-admin'), ('manager'), ('operator')
ON CONFLICT ("key") DO NOTHING;
