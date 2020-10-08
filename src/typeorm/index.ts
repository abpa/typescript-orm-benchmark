import { Router, Request, Response, NextFunction } from 'express';

import { initRepositories } from './db';
import config from './config';

const router = Router();

export async function initializeTypeOrm(): Promise<Router> {
  const { OrderRepository } = await initRepositories(config);

  router.get(
    '/orders',
    async (req: Request, res: Response, next: NextFunction) => {
      let { simple, limit, offset } = req.query;
	limit = limit?limit:10;
	offset= offset?offset:0;
      const options = simple
        ? { take:limit, skip: offset}
        : {  take: limit, skip: offset, relations: ['items'] };
      try {
        const orders = await OrderRepository.find(options);
        return res.status(200).send({ orders });
      } catch (error) {
        return next('Error processing values');
      }
    }
  );

  router.post(
    '/orders',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const orders = OrderRepository.create(req.body);
        await OrderRepository.save(orders);
        return res.status(200).send({ orders });
      } catch (error) {
        return next('Error processing values');
      }
    }
  );

  return router;
}
