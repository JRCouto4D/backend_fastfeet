import { isBefore, startOfDay, endOfDay, setHours } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class StartDeliverymanController {
  async store(req, res) {
    const starthour = setHours(startOfDay(new Date()), 8);
    const endhour = setHours(startOfDay(new Date()), 18);

    if (isBefore(new Date(), starthour) || !isBefore(new Date(), endhour)) {
      return res.status(400).json({ error: 'Out of hours allowed' });
    }

    /**
     * limit number of deliveries per day
     */

    const CheckNumberDeliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (CheckNumberDeliveries) {
      if (CheckNumberDeliveries.length >= 5) {
        return res
          .status(401)
          .json({ error: 'Number of withdrawals exceeded' });
      }
    }

    const delivery = await Delivery.findByPk(req.params.order_id);

    /**
     * Check deliverymam/delivery
     */

    if (delivery.canceled_at !== null) {
      return res
        .status(401)
        .json({ error: 'This delivery has been canceled.' });
    }

    if (!(delivery.start_date === null)) {
      return res
        .status(400)
        .json({ error: 'package already left for delivery' });
    }

    /**
     * start delivery
     */

    delivery.start_date = new Date();
    delivery.deliveryman_id = req.params.deliveryman_id;

    const { id, product, deliveryman_id, start_date } = await delivery.save();

    return res.json({ id, product, deliveryman_id, start_date });
  }
}

export default new StartDeliverymanController();
