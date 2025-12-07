This folder holds Flyway SQL migrations for the application.

How to add a migration:

- Create a file named `V{version}__description.sql`, for example `V1__initial_schema.sql`.
- Put any DDL statements required to create or modify the schema.

Notes:

- `spring.flyway.baseline-on-migrate=true` is enabled. If you're migrating an existing database, run the first migration with care or adjust baseline settings.
- We intentionally do not include a generated SQL schema here. Add migrations that match your JPA entities.
