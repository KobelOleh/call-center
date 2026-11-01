-- CreateTable
CREATE TABLE "TariffPlan" (
    "key" TEXT NOT NULL,

    CONSTRAINT "TariffPlan_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Licence" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tariffPlanKey" TEXT NOT NULL,

    CONSTRAINT "Licence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "licenceId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_userId_key" ON "Seat"("userId");

-- AddForeignKey
ALTER TABLE "Licence" ADD CONSTRAINT "Licence_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Licence" ADD CONSTRAINT "Licence_tariffPlanKey_fkey" FOREIGN KEY ("tariffPlanKey") REFERENCES "TariffPlan"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_licenceId_fkey" FOREIGN KEY ("licenceId") REFERENCES "Licence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

