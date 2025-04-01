import { z } from "zod";

const stepOneSchema = z.object({
  serviceName: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatório"),
  providerName: z.string().min(1, "Nome do prestador é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatório"),
});

const stepTwoSchema = z.object({
  price: z.string().min(1, "Valor é obrigatório"),
  unitId: z.number().min(1, "Unidade é obrigatório"),
  disponibility: z.string().min(1, "Disponibilidade é obrigatório"),
  paymentMethodId: z.array(z.number()).min(1, "Métodos de pagamento é obrigatório"),
});

const stepThreeSchema = z.object({
  image: z.string().min(1, "Imagem é obrigatório"),
});

// const stepFourSchema = z.object({
// });

const formSchema = z.object({
  stepOne: stepOneSchema,
  stepTwo: stepTwoSchema,
  stepThree: stepThreeSchema,
  // stepFour: stepFourSchema,
});

export {
  formSchema,
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  // stepFourSchema,
};
