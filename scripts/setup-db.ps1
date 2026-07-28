# Create Manuscript database user and database
# Usage: .\scripts\setup-db.ps1 -PostgresPassword "your_postgres_password"

param(
    [Parameter(Mandatory = $true)]
    [string]$PostgresPassword,

    [string]$DbUser = "manuscript",
    [string]$DbPassword = "manuscript",
    [string]$DbName = "manuscript",
    [string]$PgHost = "localhost",
    [int]$PgPort = 5432
)

$ErrorActionPreference = "Stop"

$psqlPaths = @(
    "C:\Program Files\PostgreSQL\18\bin\psql.exe",
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe"
)

$psql = $psqlPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $psql) {
    Write-Error "psql not found. Install PostgreSQL from https://www.postgresql.org/download/windows/"
}

$env:PGPASSWORD = $PostgresPassword

Write-Host "Checking PostgreSQL connection..."
& $psql -h $PgHost -p $PgPort -U postgres -d postgres -c "SELECT version();" | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Connection failed. Check postgres password and that PostgreSQL service is running."
}

$sql = @"
DO `$`$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DbUser') THEN
    CREATE USER $DbUser WITH PASSWORD '$DbPassword' CREATEDB;
  ELSE
    ALTER USER $DbUser CREATEDB;
  END IF;
END
`$`$;

SELECT 'CREATE DATABASE $DbName OWNER $DbUser'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DbName')\gexec

GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser;
"@

Write-Host "Creating user '$DbUser' and database '$DbName'..."
$sql | & $psql -h $PgHost -p $PgPort -U postgres -d postgres
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create database."
}

Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Done! DATABASE_URL:"
Write-Host "postgresql://${DbUser}:${DbPassword}@${PgHost}:${PgPort}/${DbName}?schema=public"
Write-Host ""
Write-Host "Next: npx pnpm@9.15.0 db:migrate"
