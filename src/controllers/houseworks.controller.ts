import { Request, Response } from 'express';
import { HouseworkEntity } from '../protocols/houseworks.protocol.js';
import {
  deleteHouseWorkQuery,
  insertHousework,
  selectAllHouseworks,
  selectAllResidentHouseworks,
  selectDeliveredLateHouseworks,
  selectHouseworks,
  selectLateHouseworks,
  selectResidentDeliveredLateHouseworks,
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

  if (
    (isLate && today) ||
    (isLate && deliveredLate) ||
    (deliveredLate && today)
  )
    return res
      .status(400)
      .send('You can only select one between isLate, today and deliveredLate');

  try {
    if (Object.keys(req.query).length === 0) {
      const houserworks = await selectAllHouseworks();
      return res.send(houserworks.rows);
    } else if (isLate) {
      const houseworks = await selectLateHouseworks({ id, name, date });
      return res.send(houseworks.rows);
    } else if (today) {
      const houseworks = await selectTodayHouseworks({ id, name, done });
      return res.send(houseworks.rows);
    } else if (deliveredLate) {
      const houserworks = await selectDeliveredLateHouseworks({
        id,
        name,
        date,
      });
      return res.send(houserworks.rows);
    } else {
      const houserworks = await selectHouseworks({ id, name, date, done });
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
  const { id, name, date, done, deliveredLate, isLate, today } = req.query;

  if (
    (isLate && today) ||
    (isLate && deliveredLate) ||
    (deliveredLate && today)
  )
    return res
      .status(400)
      .send('You can only select one between isLate, today and deliveredLate');

  try {
    if (Object.keys(req.query).length === 0) {
      const houserworks = await selectAllResidentHouseworks(Number(residentId));
      return res.send(houserworks.rows);
    } else if (isLate) {
      const houseworks = await selectResidentLateHouseworks(
        { id, name, date },
        Number(residentId)
      );
      return res.send(houseworks.rows);
    } else if (today) {
      const houseworks = await selectResidentTodayHouseworks(
        { id, name, done },
        Number(residentId)
      );
      return res.send(houseworks.rows);
    } else if (deliveredLate) {
      const houserworks = await selectResidentDeliveredLateHouseworks(
        {
          id,
          name,
          date,
        },
        Number(residentId)
      );
      return res.send(houserworks.rows);
    } else {
      const houserworks = await selectResidentLateHouseworks(
        { id, name, date, done },
        Number(residentId)
      );
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
