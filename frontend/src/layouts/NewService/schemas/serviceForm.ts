const serviceForm = {
  formId: "new-service-form",
  formField: {
    name: {
      name: "name",
      label: "Nome do Serviço",
      type: "text",
      errorMsg: "Nome é obrigatório.",
      placeholder: "Digite",
    },
    categoryId: {
      name: "categoryId",
      label: "Categoria",
      type: "number",
      errorMsg: "Categoria é obrigatória.",
    },
    providerName: {
      name: "providerName",
      label: "Nome do Prestador",
      type: "text",
      errorMsg: "Nome do Prestador é obrigatório.",
      errorMaxMsg: "Nome do Prestador excede o limite de caracteres",
      errorMinMsg: "Nome do Prestador deve ter no mínimo 3 caracteres",
      placeholder: "Digite",
    },
    description: {
      name: "description",
      label: "Descrição",
      type: "text",
      errorMaxMsg: "Descrição excede o limite de caracteres",
      errorMinMsg: "Descrição deve ter no mínimo 3 caracteres",
      placeholder: "Digite",
    },
    price: {
      name: "price",
      label: "Valor",
      type: "number",
      errorMsg: "Valor é obrigatório.",
      placeholder: "99.99",
    },
    unitId: {
      name: "unitId",
      label: "Unidade",
      type: "number",
      errorMsg: "Unidade é obrigatório.",
      placeholder: "Selecione",
    },
    paymentMethodIds: {
      name: "paymentMethodIds",
      label: "Método de pagamento",
      type: "number",
      errorMsg: "Método de pagamento é obrigatório.",
      placeholder: "Selecione",
    },
    lat: {
      name: "lat",
      label: "Latitude",
      type: "number",
    },
    lng: {
      name: "lng",
      label: "Longitude",
      type: "number",
    },
    radius: {
      name: "radius",
      label: "Raio",
      type: "number",
    },
  },
};

export default serviceForm;
