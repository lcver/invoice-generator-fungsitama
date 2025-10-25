CREATE TABLE "test" (
	"id" varchar(36) PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"created_at" timestamp(6) DEFAULT '2025-03-04 09:11:01.26378',
	"updated_at" timestamp(6),
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp(6),
	"created_by" varchar(255),
	"updated_by" varchar(255),
	"deleted_by" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" varchar NOT NULL,
	"description" varchar(255),
	"quantity" integer DEFAULT 1,
	"unit_price" numeric(20, 2) DEFAULT '0.00',
	"line_total" numeric(20, 2) DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_number" varchar(255) NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_address" text NOT NULL,
	"issue_date" date NOT NULL,
	"due_date" date NOT NULL,
	"total_amount" numeric(20, 2) DEFAULT '0.00',
	"status" varchar NOT NULL,
	"created_at" timestamp(6) DEFAULT now(),
	"updated_at" timestamp(6)
);
--> statement-breakpoint
DROP TABLE "module" CASCADE;