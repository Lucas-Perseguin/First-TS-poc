import { Request, Response } from 'express';
import { ResidentEntity } from '../protocols/residents.protocol.js';
import {
  insertResident,
  selectResidentsByName,
  selectResidentById,
  selectResidentsByActivity,
  selectAllResidents,
  setResidentInactive,
  deleteResidentQuery,
} from '../repositories/residents.repository.js';

export async function createResident(
  req: Request,
  res: Response
): Promise<Response<ResidentEntity>> {
  try {
    const createdResident = await insertResident(req.body);
    return res.status(201).send(createdResident.rows[0]);
  } catch (error) {
    return res.status(400).send('Name already in use');
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
    return res.status(400).send('You can only use one query string at a time');
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
    if (!editedResident.rowCount)
      return res.status(404).send('The specified resident was not found');
    return res.send(editedResident.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deleteResident(
  req: Request,
  res: Response
): Promise<Response<ResidentEntity>> {
  const { residentId } = req.params;
  try {
    const deletedResident = await deleteResidentQuery(Number(residentId));
    if (!deletedResident.rowCount)
      return res.status(404).send('The specified resident was not found');
    return res.send(deletedResident.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}
