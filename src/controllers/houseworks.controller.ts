import { Request, Response } from 'express';
import { HouseworkEntity } from '../protocols/houseworks.protocol.js';
import { insertHousework } from '../repositories/houseworks.repository.js';

export async function createHousework(
  req: Request,
  res: Response
): Promise<Response<HouseworkEntity>> {
  try {
    const createdHousework = await insertHousework(
      req.body,
      Number(req.params.residentId)
    );
    res.status(201).send(createdHousework.rows[0]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
