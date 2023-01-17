import { NextFunction, Request, Response } from 'express';
import { selectUserActitivyById } from '../repositories/residents.repository.js';

export default async function checkResidentActivity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { residentId } = req.params;
  try {
    const isActive = await selectUserActitivyById(Number(residentId));

    if (!isActive.rowCount) return res.status(404).send('Resident not found');
    else if (isActive.rows[0].isActive) return next();
    else return res.status(400).send('Resident is Inactive');
  } catch (error) {
    return res.sendStatus(500);
  }
}
