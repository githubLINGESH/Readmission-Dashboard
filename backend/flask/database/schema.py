from database.connection import get_connection, close_connection
import psycopg2

def check_primary_key(table_name, column_name):
    conn = get_connection()
    if not conn:
        return False

    cur = conn.cursor()
    
    try:
        cur.execute(f"""
            SELECT COUNT(*)
            FROM information_schema.table_constraints
            WHERE table_name = %s
            AND constraint_type = 'PRIMARY KEY'
            AND constraint_name = %s
        """, (table_name, f"{table_name}_pkey"))
        
        count = cur.fetchone()[0]
        
        if count == 0:
            print(f"Primary key constraint not found on {table_name}.{column_name}")
            return False
        else:
            print(f"Primary key constraint exists on {table_name}.{column_name}")
            return True
    except psycopg2.Error as e:
        print(f"Error checking primary key: {e}")
        return False
    finally:
        cur.close()
        close_connection(conn)

def create_tables():
    conn = get_connection()
    if not conn:
        return

    cur = conn.cursor()
    
    # Enable pgvector extension
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    
    # Create tables
    create_table_queries = [
        """
        CREATE TABLE IF NOT EXISTS discharge (
            note_id VARCHAR PRIMARY KEY,
            subject_id BIGINT,
            hadm_id BIGINT,
            note_type VARCHAR,
            note_seq BIGINT,
            charttime TIMESTAMP,
            storetime TIMESTAMP,
            text TEXT,
            embedding vector(384)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS discharge_detail (
            note_id VARCHAR,
            subject_id BIGINT,
            field_name VARCHAR,
            field_value TEXT,
            field_ordinal INT,
            PRIMARY KEY (note_id, field_name, field_ordinal)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS radiology (
            note_id VARCHAR PRIMARY KEY,
            subject_id BIGINT,
            hadm_id BIGINT,
            note_type VARCHAR,
            note_seq BIGINT,
            charttime TIMESTAMP,
            storetime TIMESTAMP,
            text TEXT,
            embedding vector(384)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS radiology_detail (
            note_id VARCHAR NOT NULL,
            subject_id BIGINT,
            field_name VARCHAR NOT NULL,
            field_value TEXT,
            field_ordinal INT NOT NULL,
            PRIMARY KEY (note_id, field_name, field_ordinal)
        );
        """
    ]


    for query in create_table_queries:
        cur.execute(query)

    conn.commit()
    cur.close()
    close_connection(conn)

    print("Tables created successfully")

def add_primary_key(table_name, column_name):
    conn = get_connection()
    if not conn:
        return

    cur = conn.cursor()
    
    try:
        cur.execute(f"ALTER TABLE {table_name} ADD PRIMARY KEY ({column_name});")
        conn.commit()
        print(f"Primary key added to {table_name}.{column_name}")
    except psycopg2.Error as e:
        print(f"Error adding primary key to {table_name}.{column_name}: {e}")
        conn.rollback()
    finally:
        cur.close()
        close_connection(conn)

def print_table_info(table_name):
    conn = get_connection()
    if not conn:
        return

    cur = conn.cursor()
    
    try:
        # Get column information
        cur.execute(f"""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = %s
        """, (table_name,))
        columns = cur.fetchall()
        
        print(f"\nTable: {table_name}")
        print("Columns:")
        for col in columns:
            print(f"  {col[0]}: {col[1]} (Nullable: {col[2]})")
        
        # Get primary key information
        cur.execute(f"""
            SELECT a.attname
            FROM   pg_index i
            JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                AND a.attnum = ANY(i.indkey)
            WHERE  i.indrelid = %s::regclass
            AND    i.indisprimary
        """, (table_name,))
        pk = cur.fetchone()
        
        if pk:
            print(f"Primary Key: {pk[0]}")
        else:
            print("No Primary Key found")
        
    except psycopg2.Error as e:
        print(f"Error getting table info: {e}")
    finally:
        cur.close()
        close_connection(conn)

# Add this to your create_tables function
for table in ['discharge', 'discharge_detail', 'radiology', 'radiology_detail']:
    print_table_info(table)

if __name__ == "__main__":
    create_tables()