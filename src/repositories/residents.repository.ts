import { QueryResult } from 'pg';
import connection from '../database.js';
import {
  Resident,
  ResidentEntity,
  ResidentsQueries,
} from '../protocols/residents.protocol.js';

export function insertResident(
  object: Resident
): Promise<QueryResult<ResidentEntity>> {
  return connection.query(
    `INSERT INTO residents (name) VALUES ($1) RETURNING *;`,
    [object.name]
  );
}

export function selectResidents(
  queries: ResidentsQueries
): Promise<QueryResult<ResidentEntity | ResidentEntity[]>> {
  const arr = ['id', 'name', 'isActive'];
  for (const index in arr) {
    if (!Object.keys(queries).includes(arr[index])) queries[arr[index]] = null;
  }
  const { id, name, isActive } = queries;
  return connection.query(
    `SELECT * FROM residents
    WHERE id = CASE WHEN $1::integer IS NOT NULL THEN $1::integer ELSE id END
    AND name ILIKE CASE WHEN $2::text IS NOT NULL THEN ('%' || $2::text || '%') ELSE name END
    AND "isActive" = CASE WHEN $3::boolean IS NOT NULL THEN $3::boolean ELSE "isActive" END;`,
    [id, name, isActive]
  );
}

export function setResidentInactive(
  id: number
): Promise<QueryResult<ResidentEntity | ResidentEntity[]>> {
  return connection.query(
    `UPDATE residents SET "isActive" = FALSE WHERE id = $1 RETURNING *;`,
    [id]
  );
}

export function selectUserActitivyById(
  id: number
): Promise<QueryResult<ResidentEntity>> {
  return connection.query(`SELECT "isActive" FROM residents WHERE id = $1;`, [
    id,
  ]);
}

export function deleteResidentQuery(
  id: number
): Promise<QueryResult<ResidentEntity>> {
  return connection.query(`DELETE FROM residents WHERE id = $1 RETURNING *;`, [
    id,
  ]);
}
