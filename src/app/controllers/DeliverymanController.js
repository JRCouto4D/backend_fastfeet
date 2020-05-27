import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { email } = req.body;

    const checkEmail = await Deliveryman.findOne({
      where: { email },
    });

    if (checkEmail) {
      return res.status(401).json({ error: 'Email already used.' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return req.status(400).json({ error: 'Validation failed.' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'deliveryman not found' });
    }

    const { email, avatar_id } = req.body;

    if (email && email !== deliveryman.email) {
      const checkEmail = await Deliveryman.findOne({
        where: { email },
      });

      if (checkEmail) {
        return res.status(401).json({ error: 'Email already used.' });
      }
    }

    const { name } = await deliveryman.update(req.body);

    return res.json({
      name,
      avatar_id,
      email,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman invalided.' });
    }

    await deliveryman.destroy();

    return res.send();
  }

  async index(req, res) {
    const { page = 1, search } = req.query;
    const total = await Deliveryman.count({
      where: { name: { [Op.iLike]: `${search}%` } },
    });

    const deliverymen = await Deliveryman.findAll({
      where: { name: { [Op.iLike]: `${search}%` } },
      limit: 5,
      offset: (page - 1) * 5,
      order: ['id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json({ deliverymen, total });
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman invalided.' });
    }

    return res.json(deliveryman);
  }
}

export default new DeliverymanController();
