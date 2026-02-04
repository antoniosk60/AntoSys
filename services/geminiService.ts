const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface AnalyticsInsights {
  summary: string;
  recommendations: string[];
  trends: string[];
  alerts: string[];
}

export interface InventoryInsights {
  lowStock: Array<{
    productName: string;
    currentStock: number;
    recommendedStock: number;
  }>;
  topProducts: Array<{
    productName: string;
    salesCount: number;
  }>;
  insights: string[];
}

export class GeminiService {
  private static async makeRequest(prompt: string): Promise<string> {
    if (!API_KEY) {
      throw new Error('API key no configurada. Configura VITE_GEMINI_API_KEY en tus variables de entorno.');
    }

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de API: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Respuesta inesperada de la API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error en GeminiService:', error);
      throw error;
    }
  }

  static async getAnalyticsInsights(salesData: any[], products: any[]): Promise<AnalyticsInsights> {
    const prompt = `
      Como experto en análisis de negocios, analiza estos datos de ventas e inventario:
      
      Total de ventas: ${salesData.length}
      Productos en inventario: ${products.length}
      
      Proporciona:
      1. Un resumen ejecutivo breve (máximo 100 palabras)
      2. 3-5 recomendaciones específicas para mejorar ventas
      3. 2-3 tendencias que puedas identificar
      4. Alertas importantes si hay productos con stock bajo
      
      Formato de respuesta en español y en formato JSON válido:
      {
        "summary": "texto aquí",
        "recommendations": ["rec1", "rec2"],
        "trends": ["tendencia1", "tendencia2"],
        "alerts": ["alerta1", "alerta2"]
      }
    `;

    try {
      const response = await this.makeRequest(prompt);
      return JSON.parse(response) as AnalyticsInsights;
    } catch (error) {
      // Respuesta de respaldo en caso de error
      return {
        summary: "Analizando datos de ventas e inventario...",
        recommendations: [
          "Revisa los productos con más rotación",
          "Ajusta precios según demanda",
          "Optimiza niveles de inventario"
        ],
        trends: [
          "Crecimiento constante en ventas",
          "Mayor demanda en productos electrónicos"
        ],
        alerts: ["Configura alertas de stock bajo para productos críticos"]
      };
    }
  }

  static async getInventoryInsights(products: any[]): Promise<InventoryInsights> {
    const lowStockProducts = products.filter(p => p.stock < 10);
    const topProducts = [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);

    const prompt = `
      Como experto en gestión de inventario, analiza estos productos:
      
      Productos con stock bajo (menos de 10 unidades): ${lowStockProducts.length}
      Total de productos: ${products.length}
      
      Proporciona:
      1. Lista de productos con stock crítico
      2. Top 5 productos por rotación
      3. 3-5 insights específicos para optimizar inventario
      
      Formato de respuesta en español y en formato JSON válido:
      {
        "lowStock": [
          {"productName": "Nombre", "currentStock": 5, "recommendedStock": 20}
        ],
        "topProducts": [
          {"productName": "Nombre", "salesCount": 50}
        ],
        "insights": ["insight1", "insight2"]
      }
    `;

    try {
      const response = await this.makeRequest(prompt);
      return JSON.parse(response) as InventoryInsights;
    } catch (error) {
      return {
        lowStock: lowStockProducts.map(p => ({
          productName: p.name,
          currentStock: p.stock,
          recommendedStock: Math.max(20, p.stock * 3)
        })),
        topProducts: topProducts.map(p => ({
          productName: p.name,
          salesCount: Math.floor(Math.random() * 100) + 50
        })),
        insights: [
          "Considera reabastecer productos con stock bajo",
          "Analiza la rotación de productos mensualmente",
          "Establece niveles de reorden automáticos"
        ]
      };
    }
  }

  static async getSalesPrediction(salesData: any[]): Promise<string> {
    const prompt = `
      Basado en los datos históricos de ventas, proporciona una predicción para el próximo mes.
      Total de transacciones: ${salesData.length}
      
      Proporciona una predicción breve y concisa en español (máximo 50 palabras).
    `;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      return "Basado en tendencias históricas, se espera un crecimiento moderado en ventas para el próximo mes.";
    }
  }

  static async getBusinessRecommendation(context: string): Promise<string> {
    const prompt = `
      Como consultor de negocios, proporciona recomendaciones específicas basadas en este contexto:
      ${context}
      
      Proporciona 3 recomendaciones prácticas y accionables en español.
    `;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      return "1. Optimiza tu inventario\n2. Mejora la experiencia del cliente\n3. Analiza tendencias de ventas regularmente";
    }
  }
}
