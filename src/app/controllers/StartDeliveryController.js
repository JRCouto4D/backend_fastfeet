import { isBefore, startOfDay, setHours } from 'date-fns';
import Delivery from '../models/Delivery';

class StartDeliveryController {
  async store(req, res) {
    const starthour = setHours(startOfDay(new Date()), 8);
    const endhour = setHours(startOfDay(new Date()), 18);

    if (isBefore(new Date(), starthour) || !isBefore(new Date(), endhour)) {
      return res.status(400).json({ error: 'Out of hours allowed' });
    }

    const delivery = await Delivery.findByPk(req.params.order_id);

    if (!delivery) {
      return res.status(401).json({ error: 'Invalid delivery' });
    }

    if (delivery.canceled_at !== null) {
      return res
        .status(401)
        .json({ error: 'This delivery has been canceled.' });
    }

    if (delivery.start_date !== null) {
      return res
        .status(400)
        .json({ error: 'This delivery has been initiated' });
    }

    delivery.start_date = new Date();

    const { id, product, start_date } = await delivery.save();

    return res.json({ id, product, start_date });
  }
}

export default new StartDeliveryController();
