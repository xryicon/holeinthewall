CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`sort_order` integer NOT NULL,
	`name_en` text NOT NULL,
	`name_es` text NOT NULL,
	`description_en` text NOT NULL,
	`description_es` text NOT NULL,
	`price_cents` integer NOT NULL
);
