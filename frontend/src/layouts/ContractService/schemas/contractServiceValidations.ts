import * as Yup from "yup";
import contractServiceForm from "./contractServiceForm";

const {
  formField: { obs, appointmentDate },
} = contractServiceForm;

const validations = [
  Yup.object().shape({
    [appointmentDate.name]: Yup.string().required(appointmentDate.errorMsg),
    [obs.name]: Yup.string().max(255, obs.errorMaxMsg).min(3, obs.errorMinMsg),
  }),
];

export default validations;
