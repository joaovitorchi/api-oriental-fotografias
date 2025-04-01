const contractServiceForm = {
  formId: "new-service-form",
  formField: {
    appointmentDate: {
      name: "appointmentDate",
      label: "Data de Agendamento",
      type: "text",
      errorMsg: "Data é obrigatória.",
      placeholder: "Digite",
    },
    obs: {
      name: "obs",
      label: "Observações (opcional)",
      type: "text",
      errorMaxMsg: "Observações excede o limite de caracteres",
      errorMinMsg: "Observações deve ter no mínimo 3 caracteres",
      placeholder: "Digite",
    },
  },
};

export default contractServiceForm;
