-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "zone" TEXT,
    "address" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT,
    "uniformName" TEXT,
    "jerseyNumber" TEXT,
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "dateOfEntry" TIMESTAMP(3),
    "seniority" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "city" TEXT,
    "geographicZone" TEXT,
    "modelType" TEXT,
    "daysOfAttendance" TEXT,
    "timeSlot" TEXT,
    "group" TEXT,
    "level" INTEGER,
    "notes" TEXT,
    "categoryId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "registeredPositionId" TEXT,
    "assignedPositionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uniform_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uniform_styles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uniform_sizes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uniform_requests" (
    "id" TEXT NOT NULL,
    "ticket" TEXT NOT NULL,
    "playerFullName" TEXT NOT NULL,
    "uniformName" TEXT NOT NULL,
    "nameMeaning" TEXT NOT NULL,
    "jerseyNumber" TEXT NOT NULL,
    "celebrationDesc" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "categoryId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "uniformTypeId" TEXT,
    "uniformStyleId" TEXT,
    "size" TEXT,
    "playerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_logs" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "successRows" INTEGER NOT NULL,
    "errorRows" INTEGER NOT NULL,
    "errors" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Completado',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "adminUserId" TEXT NOT NULL,

    CONSTRAINT "import_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "venues_name_key" ON "venues"("name");

-- CreateIndex
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "positions_name_key" ON "positions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "positions_slug_key" ON "positions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "players_code_key" ON "players"("code");

-- CreateIndex
CREATE INDEX "players_status_idx" ON "players"("status");

-- CreateIndex
CREATE INDEX "players_categoryId_idx" ON "players"("categoryId");

-- CreateIndex
CREATE INDEX "players_venueId_idx" ON "players"("venueId");

-- CreateIndex
CREATE INDEX "players_categoryId_venueId_idx" ON "players"("categoryId", "venueId");

-- CreateIndex
CREATE INDEX "players_status_categoryId_venueId_idx" ON "players"("status", "categoryId", "venueId");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_types_name_key" ON "uniform_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_types_slug_key" ON "uniform_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_styles_name_key" ON "uniform_styles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_styles_slug_key" ON "uniform_styles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_sizes_name_key" ON "uniform_sizes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uniform_requests_ticket_key" ON "uniform_requests"("ticket");

-- CreateIndex
CREATE INDEX "uniform_requests_status_idx" ON "uniform_requests"("status");

-- CreateIndex
CREATE INDEX "uniform_requests_categoryId_idx" ON "uniform_requests"("categoryId");

-- CreateIndex
CREATE INDEX "uniform_requests_venueId_idx" ON "uniform_requests"("venueId");

-- CreateIndex
CREATE INDEX "uniform_requests_playerId_idx" ON "uniform_requests"("playerId");

-- CreateIndex
CREATE INDEX "uniform_requests_jerseyNumber_idx" ON "uniform_requests"("jerseyNumber");

-- CreateIndex
CREATE INDEX "uniform_requests_createdAt_idx" ON "uniform_requests"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_registeredPositionId_fkey" FOREIGN KEY ("registeredPositionId") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_assignedPositionId_fkey" FOREIGN KEY ("assignedPositionId") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uniform_requests" ADD CONSTRAINT "uniform_requests_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uniform_requests" ADD CONSTRAINT "uniform_requests_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uniform_requests" ADD CONSTRAINT "uniform_requests_uniformTypeId_fkey" FOREIGN KEY ("uniformTypeId") REFERENCES "uniform_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uniform_requests" ADD CONSTRAINT "uniform_requests_uniformStyleId_fkey" FOREIGN KEY ("uniformStyleId") REFERENCES "uniform_styles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uniform_requests" ADD CONSTRAINT "uniform_requests_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_logs" ADD CONSTRAINT "import_logs_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
