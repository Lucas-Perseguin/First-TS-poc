import { Request, Response } from 'express';
import { HouseworkEntity } from '../protocols/houseworks.protocol.js';
import {
  deleteHouseWorkQuery,
  insertHousework,
  selectAllHouseworks,
  selectAllResidentHouseworks,
  selectDeliveredLateHouseworks,
  selectHouseworkById,
  selectHouseworksByDate,
  selectHouseworksByName,
  selectHouseworskByDone,
  selectLateHouseworks,
  selectResidentDeliveredLateHouseworks,
  selectResidentHouseworksByDate,
  selectResidentHouseworksByName,
  selectResidentHouseworskByDone,
  selectResidentLateHouseworks,
  selectResidentTodayHouseworks,
  selectTodayHouseworks,
  updateHouseWork,
  updateHouseworkCompletion,
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
  for (const key in req.query) {
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
      const houserworks = await selectDeliveredLateHouseworks();
      return res.send(houserworks.rows);
    } else {
      const houserworks = await selectAllHouseworks();
      return res.send(houserworks.rows);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getResidentHouseworks(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity | HouseworkEntity[]>> {
  const { residentId } = req.params;
  const { name, date, done, deliveredLate, isLate, today } = req.query;
  let count: number = 0;
  for (const key in req.query) {
    count++;
  }
  if (count >= 2)
    return res.status(400).send('You can only use one query string at a time');
  try {
    if (name) {
      const houseworks = await selectResidentHouseworksByName(
        name,
        Number(residentId)
      );
      return res.send(houseworks.rows);
    } else if (date) {
      const houseworks = await selectResidentHouseworksByDate(
        date,
        Number(residentId)
      );
      return res.send(houseworks.rows);
    } else if (done) {
      const houseworks = await selectResidentHouseworskByDone(
        done,
        Number(residentId)
      );
      return res.send(houseworks.rows);
    } else if (isLate) {
      const houseworks = await selectResidentLateHouseworks(Number(residentId));
      return res.send(houseworks.rows);
    } else if (today) {
      const houseworks = await selectResidentTodayHouseworks(
        Number(residentId)
      );
      return res.send(houseworks.rows);
    } else if (deliveredLate) {
      const houserworks = await selectResidentDeliveredLateHouseworks(
        Number(residentId)
      );
      return res.send(houserworks.rows);
    } else {
      const houserworks = await selectAllResidentHouseworks(Number(residentId));
      return res.send(houserworks.rows);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function completeHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  const { houseworkId } = req.params;
  try {
    const housework = await updateHouseworkCompletion(Number(houseworkId));
    if (housework.rowCount)
      return res.status(404).send('The specified housework was not found');
    return res.send(housework.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function editHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  const { houseworkId } = req.params;
  try {
    const housework = await updateHouseWork(Number(houseworkId), req.body);
    if (!housework.rowCount)
      return res.status(404).send('The specified housework was not found');
    return res.send(housework.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function delteHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  const { houseworkId } = req.params;
  try {
    const housework = await deleteHouseWorkQuery(Number(houseworkId));
    if (!housework.rowCount)
      return res.status(404).send('The specified housework was not found');
    return res.send(housework.rows[0]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
