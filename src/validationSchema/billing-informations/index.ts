import * as yup from 'yup';

export const billingInformationValidationSchema = yup.object().shape({
  card_number: yup.string().required(),
  card_name: yup.string().required(),
  expiration_date: yup.date().required(),
  cvv: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
});
