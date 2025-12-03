import { GeneratorResult } from "../types";

// Simulation Service - Providing a premium demo experience without requiring API keys
export const generateConcepts = async (
  brandName: string, 
  product: string, 
  audience: string,
  lang: 'es' | 'en'
): Promise<GeneratorResult> => {
  
  // Simulate AI processing time for realistic UX
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        brandVoiceAnalysis: lang === 'es' 
          ? "El análisis semántico sugiere una marca que busca equilibrar exclusividad con responsabilidad ecológica." 
          : "Semantic analysis suggests a brand seeking to balance exclusivity with ecological responsibility.",
        concepts: [
          {
            title: lang === 'es' ? "Esencia Elemental" : "Elemental Essence",
            tagline: lang === 'es' ? "Volver al origen es la única vanguardia." : "Returning to the source is the only vanguard.",
            visualDescription: lang === 'es' ? "Fotografía macro de texturas naturales con iluminación de estudio suave." : "Macro photography of natural textures with soft studio lighting.",
            rationale: lang === 'es' ? "Conecta con el deseo de autenticidad del consumidor premium." : "Connects with the premium consumer's desire for authenticity.",
            // Editorial Nature Macro - High Availability
            imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop"
          },
          {
            title: lang === 'es' ? "Arquitectura del Futuro" : "Future Architecture",
            tagline: lang === 'es' ? "Diseñando el mañana, hoy." : "Designing tomorrow, today.",
            visualDescription: lang === 'es' ? "Estilo minimalista moderno, formas geométricas audaces y alto contraste." : "Modern minimalist style, bold geometric shapes and high contrast.",
            rationale: lang === 'es' ? "Posiciona la marca como líder indiscutible en innovación." : "Positions the brand as the undisputed leader in innovation.",
            // Editorial Abstract Geometry - High Availability
            imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
          }
        ]
      });
    }, 2500); // 2.5s delay to simulate "thinking"
  });
};