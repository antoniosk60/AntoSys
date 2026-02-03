import { GoogleGenAI } from "@google/genai";
import { Product, Sale } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getBusinessInsights = async (products: Product[], sales: Sale[], query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Eres el consultor experto de Inteligencia de Negocios para "Zorro Abarrotero Linux". 
        Tu objetivo es maximizar la rentabilidad del mayorista.
        
        CONTEXTO DEL NEGOCIO:
        Inventario Actual: ${JSON.stringify(products)}
        Ventas Recientes: ${JSON.stringify(sales.slice(-50))}
        
        SOLICITUD DEL GERENTE: "${query}"
        
        REGLAS DE RESPUESTA:
        1. Identifica productos estrella y productos "hueso" (baja rotación).
        2. Sugiere ofertas cruzadas (ej: si compran café, ofrecer azúcar).
        3. Alerta sobre caducidades próximas o quiebres de stock.
        4. Sé directo, profesional y utiliza métricas financieras básicas.
        5. Responde en español de México.
      `,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Thinking Error:", error);
    return "Error en el razonamiento profundo de la IA. Por favor, intenta una consulta más simple.";
  }
};
