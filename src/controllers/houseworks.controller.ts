import { Request, Response } from 'express';
import { HouseworkEntity } from '../protocols/houseworks.protocol.js';
import {
  insertHousework,
  selectAllHouseworks,
  selectdeliveredLateHouseworks,
  selectHouseworkById,
  selectHouseworksByDate,
  selectHouseworksByName,
  selectHouseworskByDone,
  selectLateHouseworks,
  selectTodayHouseworks,
} from '../repositories/houseworks.repository.js';

export async function createHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  try {
    const createdHousework = await insertHousework(
      req.body,
      Number(req.params.residentId)
    );
    return res.status(201).send(createdHousework.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getHouseworks(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity | HouseworkEntity[]>> {
  const { id, name, date, done, deliveredLate, isLate, today } = req.query;
  let count: number = 0;
  for (const key in req.params) {
    count++;
  }
  if (count >= 2)
    return res.status(400).send('You can only use one query string at a time');
  try {
    if (id) {
      const housework = await selectHouseworkById(id);
      return res.send(housework.rows[0]);
    } else if (name) {
      const houseworks = await selectHouseworksByName(name);
      return res.send(houseworks.rows);
    } else if (date) {
      const houseworks = await selectHouseworksByDate(date);
      return res.send(houseworks.rows);
    } else if (done) {
      const houseworks = await selectHouseworskByDone(done);
      return res.send(houseworks.rows);
    } else if (isLate) {
      const houseworks = await selectLateHouseworks();
      return res.send(houseworks.rows);
    } else if (today) {
      const houseworks = await selectTodayHouseworks();
      return res.send(houseworks.rows);
    } else if (deliveredLate) {
      const houserworks = await selectdeliveredLateHouseworks();
      return res.send(houserworks.rows);
    } else {
      const houserworks = await selectAllHouseworks();
      return res.send(houserworks.rows);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
}
