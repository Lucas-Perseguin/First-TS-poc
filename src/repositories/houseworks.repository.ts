import { QueryResult } from 'pg';
import QueryString from 'qs';
import connection from '../database.js';
import {
  Housework,
  HouseworkEntity,
} from '../protocols/houseworks.protocol.js';

export function insertHousework(
  object: Housework,
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  const { name, description, date } = object;
  return connection.query(
    `INSERT INTO houseworks (name, description, date, responsible) VALUES ($1, $2, $3, $4) RETURNING *;`,
    [name, description, date, residentId]
  );
}

export function selectHouseworkById(
  id: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(`SELECT * FROM houseworks WHERE id = $1;`, [
    Number(id),
  ]);
}

export function selectHouseworksByName(
  name: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `SELECT * FROM houseworks WHERE name ILIKE ('%' || $1 || '%');`,
    [name]
  );
}

export function selectHouseworksByDate(
  date: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(`SELECT * FROM houseworks WHERE date = $1::date;`, [
    date,
  ]);
}

export function selectHouseworskByDone(
  done: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]
): Promise<QueryResult<HouseworkEntity>> {
  const completion = done === 'true' ? true : false;
  return connection.query(`SELECT * FROM houseworks WHERE done = $1;`, [
    completion,
  ]);
}

export function selectdeliveredLateHouseworks(): Promise<
  QueryResult<HouseworkEntity>
> {
  return connection.query(
    `SELECT * FROM houseworks
    WHERE completion IS NOT NULL
    AND completion > date;`
  );
}

export function selectLateHouseworks(): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `SELECT * FROM houseworks
    WHERE completion IS NULL
    AND NOW()::date > date;`
  );
}

export function selectTodayHouseworks(): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(`SELECT * FROM houseworks WHERE date = NOW()::date;`);
}

export function selectAllHouseworks(): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(`SELECT * FROM houseworks;`);
}
