import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Signature from '../models/Signature';

class HistoricController {
  async index(req, res) {
    const { query, page = 1, id } = req.query;

    if (query === 'handedOut') {
      const checkDeliveryman = await Deliveryman.findByPk(id);

      if (!checkDeliveryman) {
        return res.status(400).json({ error: 'Delivery man does not exist' });
      }

      const total = await Delivery.count({
        where: {
          deliveryman_id: id,
          end_date: { [Op.ne]: null },
        },
      });

      const deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          end_date: { [Op.ne]: null },
        },
        limit: 4,
        order: ['id'],
        offset: (page - 1) * 4,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['name', 'state', 'city', 'zip_code'],
          },
          {
            model: Signature,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });

      return res.json({ deliveries, total });
    }

    if (query === 'pending') {
      const total = await Delivery.count({
        where: {
          deliveryman_id: id,
          end_date: null,
        },
      });

      const deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          end_date: null,
        },
        limit: 4,
        order: ['id'],
        offset: (page - 1) * 4,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'name',
              'street',
              'number',
              'state',
              'city',
              'zip_code',
            ],
          },
          {
            model: Signature,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });

      return res.json({ deliveries, total });
    }

    return res.send();
  }
}

export default new HistoricController();
