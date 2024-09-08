import psycopg2
from config import DB_CONFIG, DB_CONFIG_mimic

def get_embed_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to mimiciv_embed database", error)
        return None

def get_mimic_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG_mimic)
        return conn
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to mimic_4 database", error)
        return None

def close_connection(conn):
    if conn:
        conn.close()
        print("PostgreSQL connection is closed")

def get_mimic_hosp_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG_mimic)
        cur = conn.cursor()
        cur.execute("SET search_path TO mimiciv_hosp")
        conn.commit()
        return conn
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to mimiciv_hosp schema", error)
        return None

def get_mimic_icu_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG_mimic)
        cur = conn.cursor()
        cur.execute("SET search_path TO mimiciv_icu")
        conn.commit()
        return conn
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to mimiciv_icu schema", error)
        return None