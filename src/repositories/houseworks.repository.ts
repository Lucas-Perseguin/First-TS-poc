import { QueryResult } from 'pg';
import QueryString from 'qs';
import connection from '../database.js';
import {
  Housework,
  HouseworkEdit,
  HouseworkEntity,
} from '../protocols/houseworks.protocol.js';

export function insertHousework(
  object: Housework,
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  const { name, description, date } = object;
  return connection.query(
    `INSERT INTO houseworks
    (name, description, date, responsible)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`,
    [name, description, date, residentId]
  );
}

//!Select Houseworks --------------------------------------------------------------------->

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

export function selectDeliveredLateHouseworks(): Promise<
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

//!End of Select Houseworks -------------------------------------------------------------->

//!Select Resident Houseworks ------------------------------------------------------------>

export function selectResidentHouseworksByName(
  name: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[],
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `SELECT * FROM houseworks
    WHERE name ILIKE ('%' || $1 || '%')
    AND responsible = $2;`,
    [name, residentId]
  );
}

export function selectResidentHouseworksByDate(
  date: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[],
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `SELECT * FROM houseworks
    WHERE date = $1::date
    AND responsible = $2;`,
    [date, residentId]
  );
}

export function selectResidentHouseworskByDone(
  done: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[],
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  const completion = done === 'true' ? true : false;
  return connection.query(
    `SELECT * FROM houseworks
    WHERE done = $1
    AND responsible = $2;`,
    [completion, residentId]
  );
}

export function selectResidentDeliveredLateHouseworks(
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `SELECT * FROM houseworks
    WHERE completion IS NOT NULL
    AND completion > date
    AND responsible = $1;`,
    [residentId]
  );
}

export function selectResidentLateHouseworks(
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `SELECT * FROM houseworks
    WHERE completion IS NULL
    AND NOW()::date > date
    AND responsible = $1;`,
    [residentId]
  );
}

export function selectResidentTodayHouseworks(
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `SELECT * FROM houseworks
    WHERE date = NOW()::date
    AND responsible = $1;`,
    [residentId]
  );
}

export function selectAllResidentHouseworks(
  residentId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(`SELECT * FROM houseworks WHERE responsible = $1;`, [
    residentId,
  ]);
}

//!End of Select Resident Houseworks ------------------------------------------------------>

export function updateHouseworkCompletion(
  houseworkId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(
    `UPDATE houseworks
    SET done = true, completion = NOW()::date
    WHERE id = $1
    RETURNING *;`,
    [houseworkId]
  );
}

export function updateHouseWork(
  houseworkId: number,
  object: HouseworkEdit
): Promise<QueryResult<HouseworkEntity>> {
  const { name, description, date, responsible } = object;
  const arr = ['name', 'description', 'date', 'responsible'];
  for (const index in arr) {
    if (!Object.keys(object).includes(arr[index])) object[arr[index]] = null;
  }
  return connection.query(
    `UPDATE houseworks
    SET
      name = CASE WHEN $1::text IS NOT NULL THEN $1::text ELSE name END,
      description = CASE WHEN $2::text IS NOT NULL THEN $2::text ELSE description END,
      date = CASE WHEN $3::date IS NOT NULL THEN $3::date ELSE date END,
      responsible = CASE WHEN $4::integer IS NOT NULL THEN $4::integer ELSE responsible END
    WHERE id = $5
    RETURNING *;`,
    [name, description, date, responsible, houseworkId]
  );
}
