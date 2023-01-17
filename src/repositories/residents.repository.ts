import { QueryResult } from 'pg';
import connection from '../database.js';
import { Resident, ResidentEntity } from '../protocols/residents.protocol.js';
import QueryString from 'qs';

export function insertResident(
  object: Resident
): Promise<QueryResult<ResidentEntity>> {
  return connection.query(
    `INSERT INTO residents (name) VALUES ($1) RETURNING *;`,
    [object.name]
  );
}

export function selectResidentsByName(
  name: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]
): Promise<QueryResult<ResidentEntity | ResidentEntity[]>> {
  return connection.query(
    `SELECT * FROM residents WHERE name ILIKE ('%' || $1 || '%');`,
    [name]
  );
}

export function selectResidentById(
  id: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]
): Promise<QueryResult<ResidentEntity | ResidentEntity[]>> {
  return connection.query(`SELECT * FROM residents WHERE id = $1;`, [
    Number(id),
  ]);
}

export function selectResidentsByActivity(
  isActive: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[]
): Promise<QueryResult<ResidentEntity | ResidentEntity[]>> {
  const activity = isActive === 'true' ? true : false;
  return connection.query(`SELECT * FROM residents WHERE "isActive" = $1;`, [
    activity,
  ]);
}

export function selectAllResidents(): Promise<
  QueryResult<ResidentEntity | ResidentEntity[]>
> {
  return connection.query(`SELECT * FROM residents;`);
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
