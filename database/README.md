# Database Deployment

1. Ensure you have SQLite installed on your machine.
2. Run the `create.sql` script using a SQLite command line tool or a SQLite GUI tool to create the database and tables. Here is an example of how to do this in the terminal:
   ```
   cd database
   sqlite3 database.db < create.sql
   ```
3. If you make changes to the `create.sql` file and need to re-create the database, first delete the existing `database.db` file:
   ```
   rm database.db
   ```
   Then re-run the `create.sql` script as described in step 2.
4. The location of the database file is specified in the `.env` file in the `DATABASE_URL` variable.
5. To view the database in VS Code, install the "SQLite" extension. Open the command palette (Ctrl+Shift+P), type "SQLite: Open Database", and navigate to your .db file.ok, i updated the readme myself.
6. Run the `dummydata.sql` script to populate the database with dummy data:
   ```
   sqlite3 database.db < dummydata.sql
   ```

