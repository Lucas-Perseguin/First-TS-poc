import { Request, Response } from 'express';
import { ResidentEntity } from '../protocols/residents.protocol.js';
import {
  insertResident,
  selectResidentsByName,
  selectResidentById,
  selectResidentsByActivity,
  selectAllResidents,
  setResidentInactive,
} from '../repositories/residents.repository.js';

export async function createResident(
  req: Request,
  res: Response
): Promise<Response<ResidentEntity>> {
  try {
    const createdResident = await insertResident(req.body);
    return res.status(201).send(createdResident.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getResidents(
  req: Request,
  res: Response
): Promise<Response<ResidentEntity | ResidentEntity[]>> {
  const { name, id, isActive } = req.query;
  if (
    (name && id) ||
    (name && isActive) ||
    (id && isActive) ||
    (name && id && isActive)
  )
    return res.sendStatus(400);
  try {
    if (name) {
      const residents = await selectResidentsByName(name);
      return res.send(residents.rows);
    } else if (id) {
      const residents = await selectResidentById(id);
      return res.send(residents.rows);
    } else if (isActive) {
      const residents = await selectResidentsByActivity(isActive);
      return res.send(residents.rows);
    } else {
      const residents = await selectAllResidents();
      return res.send(residents.rows);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function updateResident(
  req: Request,
  res: Response
): Promise<Response<ResidentEntity>> {
  const { residentId } = req.params;
  try {
    const editedResident = await setResidentInactive(Number(residentId));
    return res.send(editedResident.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}
