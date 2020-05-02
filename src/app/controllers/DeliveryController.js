import * as Yup from 'yup';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';
import NewDeliveryMail from '../jobs/newDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    /**
     * checks whether recipient and delivery man exist
     */

    const checkRecipient = await Recipient.findByPk(recipient_id);

    if (!checkRecipient) {
      return res.status(401).json({ error: 'Recipient does not exist.' });
    }

    const checkDeliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!checkDeliveryman) {
      return res.status(401).json({ error: 'Delivery man does not exist.' });
    }

    /**
     * Regiter new delivery
     */

    const { id, product } = await Delivery.create(req.body);

    /**
     * New delivery notification email
     */

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'neighborhood',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    await Queue.add(NewDeliveryMail.key, { delivery });

    return res.json({
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: req.params.id,
        start_date: null,
      },
    });

    /**
     * Verification that delivery has already started
     */

    if (!delivery) {
      return res
        .status(401)
        .json({ error: 'Your action cannot be performed. Invalid delivery' });
    }

    /**
     * Verification of recipient and delivery man
     */

    const { recipient_id, deliveryman_id } = req.body;

    if (recipient_id && recipient_id !== delivery.recipient_id) {
      const checkRecipient = await Recipient.findByPk(recipient_id);

      if (!checkRecipient) {
        return res.status(401).json({ error: 'Recipient invalided' });
      }
    }

    if (deliveryman_id && deliveryman_id !== delivery.deliveryman_id) {
      const checkDeliveryman = await Deliveryman.findByPk(deliveryman_id);

      if (!checkDeliveryman) {
        return res.status(401).json({ error: 'Delivery man does not exist.' });
      }
    }

    /**
     * Regiter update
     */

    const { product } = await delivery.update(req.body);

    return res.json({
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery invalided.' });
    }

    if (delivery.start_date !== null) {
      return res.status(401).json({
        error: 'The order has already been picked up by the delivery man',
      });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    return res.send(delivery);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const delivery = await Delivery.findAll({
      where: { product: { [Op.iLike]: `${req.query.search}%` } },
      attributes: ['product', 'start_date', 'canceled_at', 'end_date'],
      limit: 3,
      offset: (page - 1) * 3,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'state', 'city', 'zip_code'],
        },
      ],
    });

    return res.json(delivery);
  }
}

export default new DeliveryController();
