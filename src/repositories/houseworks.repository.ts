import { QueryResult } from 'pg';
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
