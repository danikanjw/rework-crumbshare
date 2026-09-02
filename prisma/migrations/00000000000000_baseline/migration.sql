-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "name" VARCHAR(100),
    "phone" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "profile_img" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pk" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "food" (
    "food_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "donor_id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "image_url" VARCHAR(500),
    "expired_at" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_pk" PRIMARY KEY ("food_id")
);

-- CreateTable
CREATE TABLE "claim" (
    "claim_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "food_id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_pk" PRIMARY KEY ("claim_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_unique_1" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_unique_2" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "claim_unique" ON "claim"("food_id");

-- AddForeignKey
ALTER TABLE "food" ADD CONSTRAINT "food_user_fk" FOREIGN KEY ("donor_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_food_fk" FOREIGN KEY ("food_id") REFERENCES "food"("food_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_user_fk" FOREIGN KEY ("recipient_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

