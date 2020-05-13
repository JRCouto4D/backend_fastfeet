import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      neighborhood: Yup.string().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string()
        .required()
        .length(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const checkName = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (checkName) {
      return res.status(400).json({ error: 'Recipient already registered.' });
    }

    const {
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      neighborhood: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string().length(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    const {
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient invalided' });
    }

    await recipient.destroy();

    return res.send();
  }

  async index(req, res) {
    const { page = 1, search } = req.query;

    const total = await Recipient.count({
      where: { name: { [Op.iLike]: `${search}%` } },
    });

    const recipients = await Recipient.findAll({
      where: { name: { [Op.iLike]: `${search}%` } },
      limit: 5,
      offset: (page - 1) * 5,
    });

    return res.json({ recipients, total });
  }
}

export default new RecipientController();
