import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"primary_url" varchar,
  	"secondary_url" varchar
  );
  
  CREATE TABLE "home_page_hero_slides_locales" (
  	"badge_label" varchar,
  	"badge_text" varchar,
  	"title" varchar NOT NULL,
  	"highlight" varchar,
  	"lead" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_hero_image_id_media_id_fk";
  
  DROP INDEX "home_page_hero_hero_image_idx";
  ALTER TABLE "home_page" ADD COLUMN "hero_interval" numeric DEFAULT 7;
  ALTER TABLE "home_page_hero_slides" ADD CONSTRAINT "home_page_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_hero_slides" ADD CONSTRAINT "home_page_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_slides_locales" ADD CONSTRAINT "home_page_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_hero_slides_order_idx" ON "home_page_hero_slides" USING btree ("_order");
  CREATE INDEX "home_page_hero_slides_parent_id_idx" ON "home_page_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_slides_image_idx" ON "home_page_hero_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_page_hero_slides_locales_locale_parent_id_unique" ON "home_page_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_slides_locales_parent_id_idx" ON "home_page_hero_slides_locales" USING btree ("_parent_id");`)

  // Keep the existing home banner: copy it into the new slider as "Slide 1" (all languages).
  await db.execute(sql`
  INSERT INTO "home_page_hero_slides" ("_order", "_parent_id", "id", "image_id", "primary_url", "secondary_url")
    SELECT 1, hp."id", 'migrated-slide-' || hp."id", hp."hero_image_id", hp."hero_primary_url", hp."hero_secondary_url"
    FROM "home_page" hp WHERE hp."hero_image_id" IS NOT NULL;
  INSERT INTO "home_page_hero_slides_locales" ("badge_label", "badge_text", "title", "highlight", "lead", "primary_label", "secondary_label", "_locale", "_parent_id")
    SELECT l."hero_badge_label", l."hero_badge_text", COALESCE(l."hero_title", ''), l."hero_highlight", l."hero_lead", l."hero_primary_label", l."hero_secondary_label", l."_locale", 'migrated-slide-' || l."_parent_id"
    FROM "home_page_locales" l
    JOIN "home_page_hero_slides" s ON s."id" = 'migrated-slide-' || l."_parent_id";`)

  await db.execute(sql`
  ALTER TABLE "home_page" DROP COLUMN "hero_image_id";
  ALTER TABLE "home_page" DROP COLUMN "hero_primary_url";
  ALTER TABLE "home_page" DROP COLUMN "hero_secondary_url";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_badge_label";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_badge_text";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_highlight";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_lead";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_primary_label";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_secondary_label";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_hero_slides" CASCADE;
  DROP TABLE "home_page_hero_slides_locales" CASCADE;
  ALTER TABLE "home_page" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "hero_primary_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "hero_secondary_url" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_badge_label" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_badge_text" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_title" varchar NOT NULL;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_highlight" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_lead" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_primary_label" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_secondary_label" varchar;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  ALTER TABLE "home_page" DROP COLUMN "hero_interval";`)
}
