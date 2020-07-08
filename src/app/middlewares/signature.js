import Delivery from '../models/Delivery';

export default async (req, res, next) => {
  const { delivery_id, deliveryman_id } = req.params;

  const delivery = await Delivery.findByPk(delivery_id);

  if (!delivery) {
    return res.status(401).json({ error: 'Invalid Delivery' });
  }

  if (delivery.deliveryman_id !== Number(deliveryman_id)) {
    return res.status(401).json({ error: 'Unauthorized operation' });
  }

  if (delivery.canceled_at !== null) {
    return res.status(401).json({ error: 'This delivery has been canceled.' });
  }

  if (delivery.start_date === null) {
    return res.status(401).json({ error: 'This delivery has not started' });
  }

  if (delivery.end_date !== null) {
    return res
      .status(401)
      .json({ error: 'This delivery has already been completed' });
  }

  return next();
};
