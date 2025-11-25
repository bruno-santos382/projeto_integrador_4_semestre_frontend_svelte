// src/lib/config.ts

import { plans } from "$lib/data/plans";
import { createApiClient } from "./client";
import { logger } from "$lib/utils/logger";

export const paymentService = (cookies, token) => {
  return {
    getPaymentStatus: async (user) => {
      const paymentId = cookies.get("pendingPayment");

      if (!paymentId) return;

      try {
        if (user?.plano === "PAGO") {
          cookies.delete("pendingPayment ", { path: "/" });
          return { justActivatedPlan: "PAGO" };
        }
        
        await createApiClient(token).post(
          `/public/webhooks/mercadopago`, {
            type: "payment",
            data: {
              id: paymentId,
            },
          }
        );

        return { showProcessingPayment: true };
      } catch (error) {
        logger.error("Error checking payment status:", error);
        return { showProcessingPayment: true };
      }
    },
    
    generatePix: async (user, planId) => {
      if (!plans?.[planId]) {
        return { error: "O plano escolhido não é válido" };
      }

      const plan = plans[planId];
      const result = await createApiClient(token).post(
        "/pagamentos/pix", {
          transactionAmount: plan.price,
          description: `Assinatura de plano ${plan.name}`,
          email: user.email,
          identificationType: "CPF",
          identificationNumber: user.cpf,
        }
      );

      if (!result?.paymentId) {
        return { error: "Não foi possível gerar o pagamento via PIX." };
      }

      cookies.set('pendingPayment', result.paymentId, { path: '/' });

      return {
        amount: plan.price,
        paymentId: result.paymentId,
        status: "PENDING",
        qrCodeBase64: result.qrCodeBase64,
        qrCode: result.qrCode,
      };
    },
  };
};
