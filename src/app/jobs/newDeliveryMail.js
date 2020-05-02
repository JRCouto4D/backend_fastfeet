import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Nova entrega',
      template: 'newdelivery',
      context: {
        deliveryman: delivery.deliveryman.name,
        recipient: delivery.recipient.name,
        street: delivery.recipient.street,
        number: delivery.recipient.number,
        neighborhood: delivery.recipient.neighborhood,
        complement: delivery.recipient.complement,
        state: delivery.recipient.state,
        city: delivery.recipient.city,
        zipcode: delivery.recipient.zip_code,
      },
    });
  }
}

export default new NewDeliveryMail();
