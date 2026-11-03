import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'am');
  CREATE TYPE "public"."enum_news_category" AS ENUM('news', 'partnership', 'workshop', 'regional', 'announcement', 'press');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_category" AS ENUM('news', 'partnership', 'workshop', 'regional', 'announcement', 'press');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('en', 'am');
  CREATE TYPE "public"."enum_services_category" AS ENUM('advocacy', 'trade', 'development');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('megaphone', 'globe', 'trending', 'graduation', 'chart', 'users', 'scale', 'badge', 'plane', 'package', 'database', 'landmark', 'sprout', 'briefcase', 'factory', 'messages', 'handshake', 'target', 'eye', 'gem', 'shield', 'star', 'bulb', 'refresh', 'building', 'file', 'calendar');
  CREATE TYPE "public"."enum_people_group" AS ENUM('board', 'management');
  CREATE TYPE "public"."enum_members_type" AS ENUM('regional', 'city', 'national', 'sectoral');
  CREATE TYPE "public"."enum_publications_category" AS ENUM('law', 'brochure', 'weekly', 'magazine', 'annual', 'research', 'other');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'progress', 'done');
  CREATE TYPE "public"."enum_subscribers_language" AS ENUM('en', 'am');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_home_page_stats_icon" AS ENUM('megaphone', 'globe', 'trending', 'graduation', 'chart', 'users', 'scale', 'badge', 'plane', 'package', 'database', 'landmark', 'sprout', 'briefcase', 'factory', 'messages', 'handshake', 'target', 'eye', 'gem', 'shield', 'star', 'bulb', 'refresh', 'building', 'file', 'calendar');
  CREATE TYPE "public"."enum_about_page_mission_values_icon" AS ENUM('megaphone', 'globe', 'trending', 'graduation', 'chart', 'users', 'scale', 'badge', 'plane', 'package', 'database', 'landmark', 'sprout', 'briefcase', 'factory', 'messages', 'handshake', 'target', 'eye', 'gem', 'shield', 'star', 'bulb', 'refresh', 'building', 'file', 'calendar');
  CREATE TYPE "public"."enum_services_page_categories_category" AS ENUM('advocacy', 'trade', 'development');
  CREATE TYPE "public"."enum_membership_page_benefits_items_icon" AS ENUM('megaphone', 'globe', 'trending', 'graduation', 'chart', 'users', 'scale', 'badge', 'plane', 'package', 'database', 'landmark', 'sprout', 'briefcase', 'factory', 'messages', 'handshake', 'target', 'eye', 'gem', 'shield', 'star', 'bulb', 'refresh', 'building', 'file', 'calendar');
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"slug" varchar,
  	"published_date" timestamp(3) with time zone,
  	"category" "enum_news_category" DEFAULT 'news',
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_category" "enum__news_v_version_category" DEFAULT 'news',
  	"version_featured" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"image_id" integer,
  	"registration_url" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_services_category" DEFAULT 'advocacy' NOT NULL,
  	"icon" "enum_services_icon" DEFAULT 'star',
  	"order" numeric DEFAULT 0,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"details" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"group" "enum_people_group" DEFAULT 'board' NOT NULL,
  	"highlight" boolean,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people_locales" (
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_members_type" DEFAULT 'regional' NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "members_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"logo_on_dark_id" integer,
  	"url" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_publications_category" DEFAULT 'other',
  	"published_date" timestamp(3) with time zone,
  	"show_on_home" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "publications_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"topic" varchar,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"language" "enum_subscribers_language" DEFAULT 'en',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_id" integer,
  	"events_id" integer,
  	"services_id" integer,
  	"people_id" integer,
  	"members_id" integer,
  	"partners_id" integer,
  	"media_id" integer,
  	"publications_id" integer,
  	"contact_messages_id" integer,
  	"subscribers_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"icon" "enum_home_page_stats_icon" DEFAULT 'building'
  );
  
  CREATE TABLE "home_page_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_about_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_about_checklist_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_pillars_items_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_membership_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_membership_steps_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"hero_primary_url" varchar,
  	"hero_secondary_url" varchar,
  	"about_image_main_id" integer,
  	"about_image_sub_id" integer,
  	"about_badge_value" varchar,
  	"about_button_url" varchar,
  	"services_feature_image_id" integer,
  	"message_person_id" integer,
  	"publications_limit" numeric DEFAULT 2,
  	"membership_primary_url" varchar,
  	"membership_secondary_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_badge_label" varchar,
  	"hero_badge_text" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_highlight" varchar,
  	"hero_lead" varchar,
  	"hero_primary_label" varchar,
  	"hero_secondary_label" varchar,
  	"about_eyebrow" varchar,
  	"about_title" varchar,
  	"about_lead" varchar,
  	"about_highlight" varchar,
  	"about_text" varchar,
  	"about_badge_label" varchar,
  	"about_button_label" varchar,
  	"pillars_eyebrow" varchar,
  	"pillars_title" varchar,
  	"pillars_lead" varchar,
  	"services_eyebrow" varchar,
  	"services_title" varchar,
  	"services_lead" varchar,
  	"services_highlight" varchar,
  	"services_button_label" varchar,
  	"message_eyebrow" varchar,
  	"message_quote" varchar,
  	"message_link_label" varchar,
  	"news_eyebrow" varchar,
  	"news_title" varchar,
  	"news_lead" varchar,
  	"news_button_label" varchar,
  	"publications_eyebrow" varchar,
  	"publications_title" varchar,
  	"publications_lead" varchar,
  	"membership_eyebrow" varchar,
  	"membership_title" varchar,
  	"membership_lead" varchar,
  	"membership_primary_label" varchar,
  	"membership_secondary_label" varchar,
  	"partners_title" varchar,
  	"partners_subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "about_page_history_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_history_items_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_mission_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_mission_values_icon" DEFAULT 'star'
  );
  
  CREATE TABLE "about_page_mission_values_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"person_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_messages_locales" (
  	"eyebrow" varchar,
  	"quote" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"overview_image_main_id" integer,
  	"overview_image_sub_id" integer,
  	"overview_badge_value" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"overview_eyebrow" varchar,
  	"overview_title" varchar,
  	"overview_lead" varchar,
  	"overview_highlight" varchar,
  	"overview_body" jsonb,
  	"overview_badge_label" varchar,
  	"history_eyebrow" varchar,
  	"history_title" varchar,
  	"history_lead" varchar,
  	"mission_eyebrow" varchar,
  	"mission_title" varchar,
  	"mission_mission" varchar,
  	"mission_vision" varchar,
  	"mission_values_eyebrow" varchar,
  	"mission_values_title" varchar,
  	"board_eyebrow" varchar,
  	"board_title" varchar,
  	"board_lead" varchar,
  	"management_eyebrow" varchar,
  	"management_title" varchar,
  	"management_lead" varchar,
  	"partners_eyebrow" varchar,
  	"partners_title" varchar,
  	"partners_lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_page_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_services_page_categories_category" NOT NULL
  );
  
  CREATE TABLE "services_page_categories_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_page_academy_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_page_academy_bullets_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"academy_enabled" boolean DEFAULT true,
  	"academy_image_id" integer,
  	"academy_badge_value" varchar,
  	"academy_button_url" varchar,
  	"feedback_enabled" boolean DEFAULT true,
  	"feedback_button_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"academy_eyebrow" varchar,
  	"academy_title" varchar,
  	"academy_lead" varchar,
  	"academy_badge_label" varchar,
  	"academy_button_label" varchar,
  	"feedback_eyebrow" varchar,
  	"feedback_title" varchar,
  	"feedback_text" varchar,
  	"feedback_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "membership_page_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_membership_page_benefits_items_icon" DEFAULT 'star'
  );
  
  CREATE TABLE "membership_page_benefits_items_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "membership_page_join_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "membership_page_join_steps_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "membership_page_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "membership_page_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "membership_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"join_button_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "membership_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"overview_eyebrow" varchar,
  	"overview_title" varchar,
  	"overview_lead" varchar,
  	"overview_body" jsonb,
  	"benefits_eyebrow" varchar,
  	"benefits_title" varchar,
  	"benefits_lead" varchar,
  	"join_eyebrow" varchar,
  	"join_title" varchar,
  	"join_lead" varchar,
  	"join_button_label" varchar,
  	"directory_eyebrow" varchar,
  	"directory_title" varchar,
  	"directory_lead" varchar,
  	"faq_eyebrow" varchar,
  	"faq_title" varchar,
  	"faq_lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "news_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "events_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "publications_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "publications_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_page_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contact_page_topics_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_text" varchar,
  	"form_title" varchar,
  	"form_text" varchar,
  	"success_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "settings_useful_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings_useful_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "settings_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings_legal_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"short_name" varchar DEFAULT 'ECCSA' NOT NULL,
  	"logo_id" integer,
  	"cta_link" varchar DEFAULT '/membership#join',
  	"phone" varchar DEFAULT '+251 115 514 005',
  	"fax" varchar DEFAULT '+251 115 517 699',
  	"po_box" varchar DEFAULT '517',
  	"email" varchar DEFAULT 'info@ethiopianchamber.com',
  	"map_embed_url" varchar,
  	"facebook" varchar,
  	"x" varchar,
  	"linkedin" varchar,
  	"youtube" varchar,
  	"telegram" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_locales" (
  	"site_name" varchar DEFAULT 'Ethiopian Chamber of Commerce and Sectoral Associations' NOT NULL,
  	"seo_description" varchar,
  	"footer_about" varchar,
  	"cta_label" varchar DEFAULT 'Become a Member',
  	"address" varchar DEFAULT 'Mexico Square, Addis Ababa, Ethiopia',
  	"hours" varchar DEFAULT 'Mon – Fri: 8:30 AM – 5:30 PM',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_locales" ADD CONSTRAINT "people_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members_locales" ADD CONSTRAINT "members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_on_dark_id_media_id_fk" FOREIGN KEY ("logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_locales" ADD CONSTRAINT "publications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stats" ADD CONSTRAINT "home_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stats_locales" ADD CONSTRAINT "home_page_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_about_checklist" ADD CONSTRAINT "home_page_about_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_about_checklist_locales" ADD CONSTRAINT "home_page_about_checklist_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_about_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pillars_items" ADD CONSTRAINT "home_page_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pillars_items_locales" ADD CONSTRAINT "home_page_pillars_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_pillars_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_membership_steps" ADD CONSTRAINT "home_page_membership_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_membership_steps_locales" ADD CONSTRAINT "home_page_membership_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_membership_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_image_main_id_media_id_fk" FOREIGN KEY ("about_image_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_image_sub_id_media_id_fk" FOREIGN KEY ("about_image_sub_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_services_feature_image_id_media_id_fk" FOREIGN KEY ("services_feature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_message_person_id_people_id_fk" FOREIGN KEY ("message_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_history_items" ADD CONSTRAINT "about_page_history_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_history_items_locales" ADD CONSTRAINT "about_page_history_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_history_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_mission_values" ADD CONSTRAINT "about_page_mission_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_mission_values_locales" ADD CONSTRAINT "about_page_mission_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_mission_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_messages" ADD CONSTRAINT "about_page_messages_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_messages" ADD CONSTRAINT "about_page_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_messages_locales" ADD CONSTRAINT "about_page_messages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_overview_image_main_id_media_id_fk" FOREIGN KEY ("overview_image_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_overview_image_sub_id_media_id_fk" FOREIGN KEY ("overview_image_sub_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_categories" ADD CONSTRAINT "services_page_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_categories_locales" ADD CONSTRAINT "services_page_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_academy_bullets" ADD CONSTRAINT "services_page_academy_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_academy_bullets_locales" ADD CONSTRAINT "services_page_academy_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_academy_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_academy_image_id_media_id_fk" FOREIGN KEY ("academy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page_locales" ADD CONSTRAINT "services_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page_benefits_items" ADD CONSTRAINT "membership_page_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page_benefits_items_locales" ADD CONSTRAINT "membership_page_benefits_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page_benefits_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page_join_steps" ADD CONSTRAINT "membership_page_join_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page_join_steps_locales" ADD CONSTRAINT "membership_page_join_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page_join_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page_faq_items" ADD CONSTRAINT "membership_page_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page_faq_items_locales" ADD CONSTRAINT "membership_page_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_page" ADD CONSTRAINT "membership_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "membership_page_locales" ADD CONSTRAINT "membership_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_page" ADD CONSTRAINT "news_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_page_locales" ADD CONSTRAINT "news_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_page" ADD CONSTRAINT "events_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_page_locales" ADD CONSTRAINT "events_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_page" ADD CONSTRAINT "publications_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications_page_locales" ADD CONSTRAINT "publications_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publications_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_topics" ADD CONSTRAINT "contact_page_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_topics_locales" ADD CONSTRAINT "contact_page_topics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_useful_links" ADD CONSTRAINT "settings_useful_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_useful_links_locales" ADD CONSTRAINT "settings_useful_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_useful_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_legal_links" ADD CONSTRAINT "settings_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_legal_links_locales" ADD CONSTRAINT "settings_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_locales" ADD CONSTRAINT "settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_locales_parent_id_idx" ON "news_locales" USING btree ("_parent_id");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_media_id_idx" ON "news_rels" USING btree ("media_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_locales_parent_id_idx" ON "_news_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_media_id_idx" ON "_news_v_rels" USING btree ("media_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_locales_parent_id_idx" ON "events_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_locales_parent_id_idx" ON "services_locales" USING btree ("_parent_id");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE UNIQUE INDEX "people_locales_locale_parent_id_unique" ON "people_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "people_locales_parent_id_idx" ON "people_locales" USING btree ("_parent_id");
  CREATE INDEX "members_updated_at_idx" ON "members" USING btree ("updated_at");
  CREATE INDEX "members_created_at_idx" ON "members" USING btree ("created_at");
  CREATE UNIQUE INDEX "members_locales_locale_parent_id_unique" ON "members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "members_locales_parent_id_idx" ON "members_locales" USING btree ("_parent_id");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_logo_on_dark_idx" ON "partners" USING btree ("logo_on_dark_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "publications_updated_at_idx" ON "publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "publications" USING btree ("created_at");
  CREATE UNIQUE INDEX "publications_filename_idx" ON "publications" USING btree ("filename");
  CREATE UNIQUE INDEX "publications_locales_locale_parent_id_unique" ON "publications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "publications_locales_parent_id_idx" ON "publications_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_members_id_idx" ON "payload_locked_documents_rels" USING btree ("members_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_stats_order_idx" ON "home_page_stats" USING btree ("_order");
  CREATE INDEX "home_page_stats_parent_id_idx" ON "home_page_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_stats_locales_locale_parent_id_unique" ON "home_page_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_stats_locales_parent_id_idx" ON "home_page_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_about_checklist_order_idx" ON "home_page_about_checklist" USING btree ("_order");
  CREATE INDEX "home_page_about_checklist_parent_id_idx" ON "home_page_about_checklist" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_about_checklist_locales_locale_parent_id_unique" ON "home_page_about_checklist_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_about_checklist_locales_parent_id_idx" ON "home_page_about_checklist_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_pillars_items_order_idx" ON "home_page_pillars_items" USING btree ("_order");
  CREATE INDEX "home_page_pillars_items_parent_id_idx" ON "home_page_pillars_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_pillars_items_locales_locale_parent_id_unique" ON "home_page_pillars_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_pillars_items_locales_parent_id_idx" ON "home_page_pillars_items_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_membership_steps_order_idx" ON "home_page_membership_steps" USING btree ("_order");
  CREATE INDEX "home_page_membership_steps_parent_id_idx" ON "home_page_membership_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_membership_steps_locales_locale_parent_id_unique" ON "home_page_membership_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_membership_steps_locales_parent_id_idx" ON "home_page_membership_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "home_page_about_about_image_main_idx" ON "home_page" USING btree ("about_image_main_id");
  CREATE INDEX "home_page_about_about_image_sub_idx" ON "home_page" USING btree ("about_image_sub_id");
  CREATE INDEX "home_page_services_services_feature_image_idx" ON "home_page" USING btree ("services_feature_image_id");
  CREATE INDEX "home_page_message_message_person_idx" ON "home_page" USING btree ("message_person_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_locales_parent_id_idx" ON "home_page_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_services_id_idx" ON "home_page_rels" USING btree ("services_id");
  CREATE INDEX "about_page_history_items_order_idx" ON "about_page_history_items" USING btree ("_order");
  CREATE INDEX "about_page_history_items_parent_id_idx" ON "about_page_history_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_history_items_locales_locale_parent_id_unique" ON "about_page_history_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_history_items_locales_parent_id_idx" ON "about_page_history_items_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_mission_values_order_idx" ON "about_page_mission_values" USING btree ("_order");
  CREATE INDEX "about_page_mission_values_parent_id_idx" ON "about_page_mission_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_mission_values_locales_locale_parent_id_unique" ON "about_page_mission_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_mission_values_locales_parent_id_idx" ON "about_page_mission_values_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_messages_order_idx" ON "about_page_messages" USING btree ("_order");
  CREATE INDEX "about_page_messages_parent_id_idx" ON "about_page_messages" USING btree ("_parent_id");
  CREATE INDEX "about_page_messages_person_idx" ON "about_page_messages" USING btree ("person_id");
  CREATE UNIQUE INDEX "about_page_messages_locales_locale_parent_id_unique" ON "about_page_messages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_messages_locales_parent_id_idx" ON "about_page_messages_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_hero_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "about_page_overview_overview_image_main_idx" ON "about_page" USING btree ("overview_image_main_id");
  CREATE INDEX "about_page_overview_overview_image_sub_idx" ON "about_page" USING btree ("overview_image_sub_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_locales_parent_id_idx" ON "about_page_locales" USING btree ("_parent_id");
  CREATE INDEX "services_page_categories_order_idx" ON "services_page_categories" USING btree ("_order");
  CREATE INDEX "services_page_categories_parent_id_idx" ON "services_page_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_categories_locales_locale_parent_id_unique" ON "services_page_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_categories_locales_parent_id_idx" ON "services_page_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "services_page_academy_bullets_order_idx" ON "services_page_academy_bullets" USING btree ("_order");
  CREATE INDEX "services_page_academy_bullets_parent_id_idx" ON "services_page_academy_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_academy_bullets_locales_locale_parent_id_uniqu" ON "services_page_academy_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_academy_bullets_locales_parent_id_idx" ON "services_page_academy_bullets_locales" USING btree ("_parent_id");
  CREATE INDEX "services_page_hero_hero_image_idx" ON "services_page" USING btree ("hero_image_id");
  CREATE INDEX "services_page_academy_academy_image_idx" ON "services_page" USING btree ("academy_image_id");
  CREATE UNIQUE INDEX "services_page_locales_locale_parent_id_unique" ON "services_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_locales_parent_id_idx" ON "services_page_locales" USING btree ("_parent_id");
  CREATE INDEX "membership_page_benefits_items_order_idx" ON "membership_page_benefits_items" USING btree ("_order");
  CREATE INDEX "membership_page_benefits_items_parent_id_idx" ON "membership_page_benefits_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "membership_page_benefits_items_locales_locale_parent_id_uniq" ON "membership_page_benefits_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "membership_page_benefits_items_locales_parent_id_idx" ON "membership_page_benefits_items_locales" USING btree ("_parent_id");
  CREATE INDEX "membership_page_join_steps_order_idx" ON "membership_page_join_steps" USING btree ("_order");
  CREATE INDEX "membership_page_join_steps_parent_id_idx" ON "membership_page_join_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "membership_page_join_steps_locales_locale_parent_id_unique" ON "membership_page_join_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "membership_page_join_steps_locales_parent_id_idx" ON "membership_page_join_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "membership_page_faq_items_order_idx" ON "membership_page_faq_items" USING btree ("_order");
  CREATE INDEX "membership_page_faq_items_parent_id_idx" ON "membership_page_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "membership_page_faq_items_locales_locale_parent_id_unique" ON "membership_page_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "membership_page_faq_items_locales_parent_id_idx" ON "membership_page_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "membership_page_hero_hero_image_idx" ON "membership_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "membership_page_locales_locale_parent_id_unique" ON "membership_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "membership_page_locales_parent_id_idx" ON "membership_page_locales" USING btree ("_parent_id");
  CREATE INDEX "news_page_hero_hero_image_idx" ON "news_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "news_page_locales_locale_parent_id_unique" ON "news_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_page_locales_parent_id_idx" ON "news_page_locales" USING btree ("_parent_id");
  CREATE INDEX "events_page_hero_hero_image_idx" ON "events_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "events_page_locales_locale_parent_id_unique" ON "events_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_page_locales_parent_id_idx" ON "events_page_locales" USING btree ("_parent_id");
  CREATE INDEX "publications_page_hero_hero_image_idx" ON "publications_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "publications_page_locales_locale_parent_id_unique" ON "publications_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "publications_page_locales_parent_id_idx" ON "publications_page_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_page_topics_order_idx" ON "contact_page_topics" USING btree ("_order");
  CREATE INDEX "contact_page_topics_parent_id_idx" ON "contact_page_topics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_page_topics_locales_locale_parent_id_unique" ON "contact_page_topics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_topics_locales_parent_id_idx" ON "contact_page_topics_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_page_hero_hero_image_idx" ON "contact_page" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_locales_parent_id_idx" ON "contact_page_locales" USING btree ("_parent_id");
  CREATE INDEX "settings_useful_links_order_idx" ON "settings_useful_links" USING btree ("_order");
  CREATE INDEX "settings_useful_links_parent_id_idx" ON "settings_useful_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "settings_useful_links_locales_locale_parent_id_unique" ON "settings_useful_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_useful_links_locales_parent_id_idx" ON "settings_useful_links_locales" USING btree ("_parent_id");
  CREATE INDEX "settings_legal_links_order_idx" ON "settings_legal_links" USING btree ("_order");
  CREATE INDEX "settings_legal_links_parent_id_idx" ON "settings_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "settings_legal_links_locales_locale_parent_id_unique" ON "settings_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_legal_links_locales_parent_id_idx" ON "settings_legal_links_locales" USING btree ("_parent_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");
  CREATE UNIQUE INDEX "settings_locales_locale_parent_id_unique" ON "settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_locales_parent_id_idx" ON "settings_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "people_locales" CASCADE;
  DROP TABLE "members" CASCADE;
  DROP TABLE "members_locales" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "publications" CASCADE;
  DROP TABLE "publications_locales" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_stats" CASCADE;
  DROP TABLE "home_page_stats_locales" CASCADE;
  DROP TABLE "home_page_about_checklist" CASCADE;
  DROP TABLE "home_page_about_checklist_locales" CASCADE;
  DROP TABLE "home_page_pillars_items" CASCADE;
  DROP TABLE "home_page_pillars_items_locales" CASCADE;
  DROP TABLE "home_page_membership_steps" CASCADE;
  DROP TABLE "home_page_membership_steps_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "about_page_history_items" CASCADE;
  DROP TABLE "about_page_history_items_locales" CASCADE;
  DROP TABLE "about_page_mission_values" CASCADE;
  DROP TABLE "about_page_mission_values_locales" CASCADE;
  DROP TABLE "about_page_messages" CASCADE;
  DROP TABLE "about_page_messages_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "services_page_categories" CASCADE;
  DROP TABLE "services_page_categories_locales" CASCADE;
  DROP TABLE "services_page_academy_bullets" CASCADE;
  DROP TABLE "services_page_academy_bullets_locales" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "services_page_locales" CASCADE;
  DROP TABLE "membership_page_benefits_items" CASCADE;
  DROP TABLE "membership_page_benefits_items_locales" CASCADE;
  DROP TABLE "membership_page_join_steps" CASCADE;
  DROP TABLE "membership_page_join_steps_locales" CASCADE;
  DROP TABLE "membership_page_faq_items" CASCADE;
  DROP TABLE "membership_page_faq_items_locales" CASCADE;
  DROP TABLE "membership_page" CASCADE;
  DROP TABLE "membership_page_locales" CASCADE;
  DROP TABLE "news_page" CASCADE;
  DROP TABLE "news_page_locales" CASCADE;
  DROP TABLE "events_page" CASCADE;
  DROP TABLE "events_page_locales" CASCADE;
  DROP TABLE "publications_page" CASCADE;
  DROP TABLE "publications_page_locales" CASCADE;
  DROP TABLE "contact_page_topics" CASCADE;
  DROP TABLE "contact_page_topics_locales" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "settings_useful_links" CASCADE;
  DROP TABLE "settings_useful_links_locales" CASCADE;
  DROP TABLE "settings_legal_links" CASCADE;
  DROP TABLE "settings_legal_links_locales" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_news_category";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_category";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_services_category";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_people_group";
  DROP TYPE "public"."enum_members_type";
  DROP TYPE "public"."enum_publications_category";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_subscribers_language";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_home_page_stats_icon";
  DROP TYPE "public"."enum_about_page_mission_values_icon";
  DROP TYPE "public"."enum_services_page_categories_category";
  DROP TYPE "public"."enum_membership_page_benefits_items_icon";`)
}
