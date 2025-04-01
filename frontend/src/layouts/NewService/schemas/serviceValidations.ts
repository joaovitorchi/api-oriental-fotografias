import * as Yup from "yup";
import serviceForm from "./serviceForm";

const {
  formField: {
    name,
    providerName,
    description,
    categoryId,
    price,
    unitId,
    paymentMethodIds,
    lat,
    lng,
    radius,
  },
} = serviceForm;

const validations = [
  Yup.object().shape({
    [name.name]: Yup.string().required(name.errorMsg),
    [providerName.name]: Yup.string()
      .max(255, providerName.errorMaxMsg)
      .min(3, providerName.errorMinMsg)
      .required(providerName.errorMsg),
    [categoryId.name]: Yup.number().required(categoryId.errorMsg),
    [description.name]: Yup.string()
      .max(500, description.errorMaxMsg)
      .min(3, description.errorMinMsg),
  }),
  Yup.object().shape({
    [price.name]: Yup.number().required(price.errorMsg),
    [unitId.name]: Yup.number().required(unitId.errorMsg),
    [paymentMethodIds.name]: Yup.array(Yup.number()).required(paymentMethodIds.errorMsg),
  }),
  Yup.object().shape({
    [lat.name]: Yup.number(),
    [lng.name]: Yup.number(),
    [radius.name]: Yup.number(),
  }),
];

export default validations;
