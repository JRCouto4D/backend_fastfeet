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

    const { email, avatar_id } = req.body;

    const checkEmail = await Deliveryman.findOne({
      where: { email },
    });

    if (checkEmail) {
      return res.status(401).json({ error: 'Email already used.' });
    }

    if (avatar_id) {
      const avatar = await File.findByPk(avatar_id);

      if (!avatar) {
        return res.json(401).json({ error: 'Invalid Avatar' });
      }
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
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

    if (avatar_id && avatar_id !== deliveryman.avatar_id) {
      const avatar = await File.findByPk(avatar_id);

      if (!avatar) {
        return res.json(401).json({ error: 'Invalid Avatar' });
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

    const deliverymen = await Deliveryman.findAll({
      where: { name: { [Op.iLike]: `${search}%` } },
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymen);
  }
}

export default new DeliverymanController();
