const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1'

const KIMI_KEY = import.meta.env.VITE_NVIDIA_KIMI_KEY
const GLM_KEY = import.meta.env.VITE_NVIDIA_GLM_KEY
const NEMOTRON_KEY = import.meta.env.VITE_NVIDIA_NEMOTRON_KEY

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
}

interface NvidiaResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

async function callNvidiaModel(
  model: string,
  apiKey: string,
  messages: ChatMessage[],
  maxTokens = 1024,
  temperature = 0.3
): Promise<string> {
  const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`NVIDIA API error (${response.status}): ${error}`)
  }

  const data: NvidiaResponse = await response.json()
  return data.choices[0]?.message?.content ?? ''
}

export async function analyzeProductImage(base64Image: string): Promise<{
  name: string
  category: string
  unit: string
  shelfLifeDays: number
  confidence: number
  storageZone: string
}> {
  const prompt = `You are a restaurant inventory assistant. Analyze this food product image and return ONLY a JSON object with these fields:
{
  "name": "product name in Spanish",
  "category": "one of: carnes, pescados, lacteos, verduras, frutas, abarrotes, bebidas, congelados, condimentos, limpieza",
  "unit": "one of: kg, lt, unidad, caja, botella, bolsa",
  "shelfLifeDays": number (estimated shelf life in days),
  "confidence": number between 0 and 1,
  "storageZone": "one of: refrigerado, congelado, seco, ambiente"
}
Return ONLY the JSON, no other text.`

  try {
    const result = await callNvidiaModel(
      'moonshotai/kimi-k2-instruct',
      KIMI_KEY,
      [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      512,
      0.2
    )

    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON in response')
  } catch {
    return analyzeWithFallback(base64Image)
  }
}

export async function getInventoryRecommendations(context: {
  totalProducts: number
  lossPercentage: number
  preventableRate: number
  topLossReasons: string[]
  expiringCount: number
  lowStockCount: number
  language: 'es' | 'en'
}): Promise<string[]> {
  const lang = context.language === 'es' ? 'Spanish' : 'English'
  const prompt = `You are a restaurant inventory optimization expert. Based on this data, provide 3-5 actionable recommendations in ${lang}:

- Total products: ${context.totalProducts}
- Loss percentage: ${context.lossPercentage.toFixed(1)}% (target: 2%)
- Preventable loss rate: ${context.preventableRate.toFixed(1)}%
- Top loss reasons: ${context.topLossReasons.join(', ')}
- Products expiring soon: ${context.expiringCount}
- Low stock products: ${context.lowStockCount}

Return ONLY a JSON array of strings, each being one recommendation. No other text.`

  try {
    const result = await callNvidiaModel(
      'google/glm-5',
      GLM_KEY,
      [{ role: 'user', content: prompt }],
      512,
      0.4
    )

    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return getDefaultRecommendations(context)
  } catch {
    return getDefaultRecommendations(context)
  }
}

function analyzeWithFallback(_base64: string) {
  const categories = ['verduras', 'carnes', 'abarrotes', 'lacteos', 'frutas']
  const category = categories[Math.floor(Math.random() * categories.length)]
  const zoneMap: Record<string, string> = {
    carnes: 'refrigerado', pescados: 'refrigerado', lacteos: 'refrigerado',
    verduras: 'refrigerado', frutas: 'ambiente', abarrotes: 'seco',
    bebidas: 'ambiente', congelados: 'congelado', condimentos: 'seco', limpieza: 'seco',
  }
  return {
    name: 'Producto detectado',
    category,
    unit: 'kg' as const,
    shelfLifeDays: 7,
    confidence: 0.35,
    storageZone: zoneMap[category] || 'ambiente',
  }
}

function getDefaultRecommendations(context: {
  lossPercentage: number
  preventableRate: number
  expiringCount: number
  language: 'es' | 'en'
}): string[] {
  if (context.language === 'es') {
    const recs = []
    if (context.lossPercentage > 2) recs.push('Las mermas superan el objetivo del 2%. Revisa los procesos de almacenamiento y rotación FIFO.')
    if (context.preventableRate > 50) recs.push('Más del 50% de las mermas son prevenibles. Capacita al equipo en manejo de productos.')
    if (context.expiringCount > 0) recs.push(`Hay ${context.expiringCount} productos por vencer. Prioriza su uso en el menú de hoy.`)
    recs.push('Mantén un registro diario de temperaturas de refrigeradores y congeladores.')
    return recs
  }
  const recs = []
  if (context.lossPercentage > 2) recs.push('Losses exceed the 2% target. Review storage processes and FIFO rotation.')
  if (context.preventableRate > 50) recs.push('Over 50% of losses are preventable. Train staff on product handling.')
  if (context.expiringCount > 0) recs.push(`${context.expiringCount} products expiring soon. Prioritize in today's menu.`)
  recs.push('Maintain a daily temperature log for refrigerators and freezers.')
  return recs
}
