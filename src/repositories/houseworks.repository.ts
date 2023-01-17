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

export function selectDeliveredLateHouseworks(
  queries
): Promise<QueryResult<HouseworkEntity>> {
  const arr = ['id', 'name', 'date', 'responsible'];
  for (const index in arr) {
    if (!Object.keys(queries).includes(arr[index])) queries[arr[index]] = null;
  }
  const { id, name, date, responsible } = queries;
  return connection.query(
    `SELECT * FROM houseworks
    WHERE completion IS NOT NULL
    AND completion > date
    AND id = CASE WHEN $1::integer IS NOT NULL THEN $1::integer ELSE id END
    AND name ILIKE CASE WHEN $2::text IS NOT NULL THEN ('%' || $2::text || '%') ELSE name END
    AND date = CASE WHEN $3::date IS NOT NULL THEN $3::date ELSE date END
    AND responsible = CASE WHEN $4::integer IS NOT NULL THEN $4::integer ELSE responsible END;`,
    [id, name, date, responsible]
  );
}

export function selectLateHouseworks(
  queries
): Promise<QueryResult<HouseworkEntity>> {
  const arr = ['id', 'name', 'date', 'responsible'];
  for (const index in arr) {
    if (!Object.keys(queries).includes(arr[index])) queries[arr[index]] = null;
  }
  const { id, name, date, responsible } = queries;
  return connection.query(
    `SELECT * FROM houseworks
    WHERE completion IS NULL
    AND NOW()::date > date
    AND id = CASE WHEN $1::integer IS NOT NULL THEN $1::integer ELSE id END
    AND name ILIKE CASE WHEN $2::text IS NOT NULL THEN ('%' || $2::text || '%') ELSE name END
    AND date = CASE WHEN $3::date IS NOT NULL THEN $3::date ELSE date END
    AND responsible = CASE WHEN $4::integer IS NOT NULL THEN $4::integer ELSE responsible END;`,
    [id, name, date, responsible]
  );
}

export function selectTodayHouseworks(
  queries
): Promise<QueryResult<HouseworkEntity>> {
  const arr = ['id', 'name', 'done', 'responsible'];
  for (const index in arr) {
    if (!Object.keys(queries).includes(arr[index])) queries[arr[index]] = null;
  }
  const { id, name, done, responsible } = queries;
  return connection.query(
    `SELECT * FROM houseworks
    WHERE date = NOW()::date
    AND id = CASE WHEN $1::integer IS NOT NULL THEN $1::integer ELSE id END
    AND name ILIKE CASE WHEN $2::text IS NOT NULL THEN ('%' || $2::text || '%') ELSE name END
    AND done = CASE WHEN $3::boolean IS NOT NULL THEN $3::boolean ELSE done END
    AND responsible = CASE WHEN $4::integer IS NOT NULL THEN $4::integer ELSE responsible END;`,
    [id, name, done, responsible]
  );
}

export function selectAllHouseworks(): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(`SELECT * FROM houseworks;`);
}

export function selectHouseworks(
  queries
): Promise<QueryResult<HouseworkEntity>> {
  const arr = ['id', 'name', 'date', 'done', 'responsible'];
  for (const index in arr) {
    if (!Object.keys(queries).includes(arr[index])) queries[arr[index]] = null;
  }
  const { id, name, date, done, responsible } = queries;
  return connection.query(
    `SELECT * FROM houseworks
    WHERE done = CASE WHEN $4::boolean IS NOT NULL THEN $4::boolean ELSE done END
    AND id = CASE WHEN $1::integer IS NOT NULL THEN $1::integer ELSE id END
    AND name ILIKE CASE WHEN $2::text IS NOT NULL THEN ('%' || $2::text || '%') ELSE name END
    AND date = CASE WHEN $3::date IS NOT NULL THEN $3::date ELSE date END
    AND responsible = CASE WHEN $5::integer IS NOT NULL THEN $5::integer ELSE responsible END;`,
    [id, name, date, done, responsible]
  );
}

//!End of Select Houseworks -------------------------------------------------------------->

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

export function deleteHouseWorkQuery(
  houseworkId: number
): Promise<QueryResult<HouseworkEntity>> {
  return connection.query(`DELETE FROM houseworks WHERE id = $1 RETURNING *;`, [
    houseworkId,
  ]);
}
