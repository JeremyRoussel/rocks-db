CREATE TABLE "users" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "full_name" varchar(100)
);

CREATE TABLE "catalogue" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "project" varchar(100) NOT NULL,
  "user" int NOT NULL,
  "field" varchar(100),
  "well" varchar(100)
);

CREATE TABLE "triax" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "sampleID" int NOT NULL,
  "file_loc" varchar NOT NULL
);

CREATE TABLE "petro_props" (
  "id" SERIAL PRIMARY KEY,
  "sampleID" int UNIQUE NOT NULL,
  "phi" FLOAT,
  "k" FLOAT,
  "length" FLOAT,
  "diameter" FLOAT
);

CREATE TABLE "thin_section" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "sampleID" int NOT NULL,
  "file_loc" varchar NOT NULL
);

ALTER TABLE "catalogue" ADD FOREIGN KEY ("user") REFERENCES "users" ("id");

ALTER TABLE "triax" ADD FOREIGN KEY ("sampleID") REFERENCES "catalogue" ("id");

ALTER TABLE "petro_props" ADD FOREIGN KEY ("sampleID") REFERENCES "catalogue" ("id");

ALTER TABLE "thin_section" ADD FOREIGN KEY ("sampleID") REFERENCES "catalogue" ("id");