import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, Scan, Loader2, Check, RotateCcw, Zap, Package, Plus } from 'lucide-react';
import { Language, BodegaProduct, ProductCategory, StorageZone } from '../types';

interface CameraScannerProps {
  lang: Language;
  existingProducts: BodegaProduct[];
  onProductIdentified: (product: Partial<BodegaProduct>) => void;
  onProductMatched: (productId: string) => void;
  onClose: () => void;
}

interface IdentifiedProduct {
  name: string;
  category: ProductCategory;
  storageZone: StorageZone;
  unit: string;
  shelfLifeDays: number;
  confidence: number;
  matchedExisting?: BodegaProduct;
}

const ZONE_BY_CATEGORY: Record<ProductCategory, StorageZone> = {
  carnes: 'refrigerado',
  pescados: 'refrigerado',
  lacteos: 'refrigerado',
  verduras: 'refrigerado',
  frutas: 'ambiente',
  abarrotes: 'seco',
  bebidas: 'seco',
  congelados: 'congelado',
  condimentos: 'seco',
  limpieza: 'seco',
};

const SHELF_LIFE_BY_CATEGORY: Record<ProductCategory, number> = {
  carnes: 5,
  pescados: 3,
  lacteos: 10,
  verduras: 7,
  frutas: 5,
  abarrotes: 180,
  bebidas: 365,
  congelados: 90,
  condimentos: 180,
  limpieza: 730,
};

const CameraScanner: React.FC<CameraScannerProps> = ({
  lang,
  existingProducts,
  onProductIdentified,
  onProductMatched,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<IdentifiedProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const t = lang === 'es'
    ? {
        title: 'Identificación por Cámara',
        subtitle: 'Escanea un producto para identificarlo automáticamente',
        startCamera: 'Activar cámara',
        capture: 'Capturar',
        analyzing: 'Analizando producto...',
        identified: 'Producto identificado',
        confidence: 'Confianza',
        category: 'Categoría',
        zone: 'Zona',
        shelfLife: 'Vida útil',
        days: 'días',
        matchFound: 'Coincidencia en inventario',
        noMatch: 'Producto nuevo — no está en inventario',
        addAsNew: 'Agregar como nuevo',
        selectMatch: 'Seleccionar existente',
        retry: 'Escanear de nuevo',
        cameraError: 'No se pudo acceder a la cámara. Verifica los permisos.',
        switchCamera: 'Cambiar cámara',
        tip: 'Acerca el producto a la cámara para mejor detección',
        orUpload: 'Subir imagen',
        name: 'Nombre',
      }
    : {
        title: 'Camera Identification',
        subtitle: 'Scan a product to identify it automatically',
        startCamera: 'Start camera',
        capture: 'Capture',
        analyzing: 'Analyzing product...',
        identified: 'Product identified',
        confidence: 'Confidence',
        category: 'Category',
        zone: 'Zone',
        shelfLife: 'Shelf life',
        days: 'days',
        matchFound: 'Match found in inventory',
        noMatch: 'New product — not in inventory',
        addAsNew: 'Add as new',
        selectMatch: 'Select existing',
        retry: 'Scan again',
        cameraError: 'Could not access camera. Check permissions.',
        switchCamera: 'Switch camera',
        tip: 'Bring the product closer for better detection',
        orUpload: 'Upload image',
        name: 'Name',
      };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setError(t.cameraError);
    }
  }, [facingMode, t.cameraError]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, [stopCamera]);

  const findExistingMatch = useCallback(
    (name: string, category: ProductCategory): BodegaProduct | undefined => {
      const nameLower = name.toLowerCase();
      return (
        existingProducts.find((p) => p.name.toLowerCase() === nameLower) ||
        existingProducts.find(
          (p) => p.name.toLowerCase().includes(nameLower) || nameLower.includes(p.name.toLowerCase())
        ) ||
        existingProducts.find(
          (p) => p.category === category && nameLower.split(' ').some((w) => w.length > 3 && p.name.toLowerCase().includes(w))
        )
      );
    },
    [existingProducts]
  );

  const analyzeLocally = useCallback(
    (imageDataUrl: string) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setAnalyzing(false); return; }
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let rTotal = 0, gTotal = 0, bTotal = 0, count = 0;
        const step = Math.max(4, Math.floor(pixels.length / 400) * 4);
        for (let i = 0; i < pixels.length; i += step) {
          rTotal += pixels[i];
          gTotal += pixels[i + 1];
          bTotal += pixels[i + 2];
          count++;
        }
        const rAvg = rTotal / count;
        const gAvg = gTotal / count;
        const bAvg = bTotal / count;

        let category: ProductCategory = 'abarrotes';
        let name = lang === 'es' ? 'Producto detectado' : 'Detected product';
        let confidence = 35;

        if (rAvg > 150 && gAvg < 100 && bAvg < 100) {
          category = 'carnes'; name = lang === 'es' ? 'Producto cárnico' : 'Meat product'; confidence = 40;
        } else if (gAvg > 120 && rAvg < 130 && bAvg < 100) {
          category = 'verduras'; name = lang === 'es' ? 'Producto vegetal' : 'Vegetable product'; confidence = 40;
        } else if (rAvg > 180 && gAvg > 150 && bAvg < 100) {
          category = 'frutas'; name = lang === 'es' ? 'Fruta' : 'Fruit'; confidence = 35;
        } else if (rAvg > 200 && gAvg > 200 && bAvg > 200) {
          category = 'lacteos'; name = lang === 'es' ? 'Producto lácteo' : 'Dairy product'; confidence = 30;
        }

        const identified: IdentifiedProduct = {
          name, category,
          storageZone: ZONE_BY_CATEGORY[category],
          unit: 'kg',
          shelfLifeDays: SHELF_LIFE_BY_CATEGORY[category],
          confidence,
        };
        const match = findExistingMatch(name, category);
        if (match) { identified.matchedExisting = match; identified.confidence = Math.min(confidence + 15, 100); }
        setResult(identified);
        setAnalyzing(false);
      };
      img.src = imageDataUrl;
    },
    [lang, findExistingMatch]
  );

  const analyzeImage = useCallback(
    async (imageDataUrl: string) => {
      setAnalyzing(true);
      setResult(null);
      setError(null);

      try {
        const apiKey =
          (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY) ||
          (typeof process !== 'undefined' && (process as any).env?.API_KEY) ||
          '';

        if (apiKey) {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey });
          const base64Data = imageDataUrl.split(',')[1];

          const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                  {
                    text: `You are a restaurant inventory assistant for a Chilean restaurant bodega.
Identify the food product or supply in this image.
Respond ONLY in JSON:
{
  "name": "product name in Spanish",
  "name_en": "product name in English",
  "category": "one of: carnes, pescados, lacteos, verduras, frutas, abarrotes, bebidas, congelados, condimentos, limpieza",
  "unit": "one of: kg, lt, unidad, caja, botella, bolsa",
  "shelf_life_days": number,
  "confidence": 0-100
}`,
                  },
                ],
              },
            ],
          });

          const text = response?.text || '';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const category = (parsed.category || 'abarrotes') as ProductCategory;
            const identified: IdentifiedProduct = {
              name: lang === 'es' ? parsed.name : (parsed.name_en || parsed.name),
              category,
              storageZone: ZONE_BY_CATEGORY[category] || 'ambiente',
              unit: parsed.unit || 'kg',
              shelfLifeDays: parsed.shelf_life_days || SHELF_LIFE_BY_CATEGORY[category],
              confidence: parsed.confidence || 70,
            };
            const match = findExistingMatch(identified.name, category);
            if (match) identified.matchedExisting = match;
            setResult(identified);
            setAnalyzing(false);
            return;
          }
        }
        analyzeLocally(imageDataUrl);
      } catch {
        analyzeLocally(imageDataUrl);
      }
    },
    [lang, findExistingMatch, analyzeLocally]
  );

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
    analyzeImage(dataUrl);
  }, [stopCamera, analyzeImage]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCapturedImage(dataUrl);
        stopCamera();
        analyzeImage(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [stopCamera, analyzeImage]
  );

  const reset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setAnalyzing(false);
  }, []);

  const handleAddNew = useCallback(() => {
    if (!result) return;
    onProductIdentified({
      name: result.name,
      category: result.category,
      storageZone: result.storageZone,
      unit: result.unit,
      shelfLifeDays: result.shelfLifeDays,
    });
  }, [result, onProductIdentified]);

  const handleSelectExisting = useCallback(() => {
    if (!result?.matchedExisting) return;
    onProductMatched(result.matchedExisting.id);
  }, [result, onProductMatched]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-austral-dark border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-austral-clay" />
            <div>
              <h3 className="text-lg font-serif text-white">{t.title}</h3>
              <p className="text-xs text-gray-500">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!capturedImage ? (
            <div className="space-y-4">
              {/* Camera viewfinder */}
              <div className="relative bg-black/40 border border-white/5 aspect-video flex items-center justify-center overflow-hidden">
                {cameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-austral-clay/50">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-austral-clay" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-austral-clay" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-austral-clay" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-austral-clay" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <Scan className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">{t.tip}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {!cameraActive ? (
                  <button onClick={startCamera} className="flex-1 bg-austral-clay text-white py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-austral-clay/80 transition-all">
                    <Camera className="w-4 h-4" /> {t.startCamera}
                  </button>
                ) : (
                  <>
                    <button onClick={capturePhoto} className="flex-1 bg-austral-clay text-white py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-austral-clay/80 transition-all">
                      <Zap className="w-4 h-4" /> {t.capture}
                    </button>
                    <button onClick={switchCamera} className="border border-white/20 text-white py-3 px-4 flex items-center justify-center gap-2 text-sm hover:bg-white/5 transition-all">
                      <RotateCcw className="w-4 h-4" /> {t.switchCamera}
                    </button>
                  </>
                )}
                <button onClick={() => fileInputRef.current?.click()} className="border border-white/20 text-white py-3 px-4 flex items-center justify-center gap-2 text-sm hover:bg-white/5 transition-all">
                  <Package className="w-4 h-4" /> {t.orUpload}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Captured image */}
              <div className="relative bg-black/40 border border-white/5 aspect-video overflow-hidden">
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-austral-clay animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-300">{t.analyzing}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Result */}
              {result && (
                <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <p className="text-sm font-bold text-green-400 uppercase tracking-wider">{t.identified}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.name}</p>
                      <p className="text-white font-medium">{result.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.confidence}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/5 h-2">
                          <div
                            className={`h-2 transition-all ${result.confidence >= 70 ? 'bg-green-500' : result.confidence >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{result.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.category}</p>
                      <p className="text-gray-300">{result.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.zone}</p>
                      <p className="text-gray-300">{result.storageZone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.shelfLife}</p>
                      <p className="text-gray-300">{result.shelfLifeDays} {t.days}</p>
                    </div>
                  </div>

                  {result.matchedExisting ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-4">
                      <p className="text-sm text-green-400 font-medium mb-1">{t.matchFound}</p>
                      <p className="text-xs text-gray-400">
                        {result.matchedExisting.name} — {result.matchedExisting.sku} — Stock: {result.matchedExisting.currentStock} {result.matchedExisting.unit}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4">
                      <p className="text-sm text-yellow-400 font-medium">{t.noMatch}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {result.matchedExisting && (
                      <button onClick={handleSelectExisting} className="flex-1 bg-green-600 text-white py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-green-700 transition-all">
                        <Check className="w-4 h-4" /> {t.selectMatch}
                      </button>
                    )}
                    <button onClick={handleAddNew} className="flex-1 bg-austral-clay text-white py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-austral-clay/80 transition-all">
                      <Plus className="w-4 h-4" /> {t.addAsNew}
                    </button>
                    <button onClick={reset} className="border border-white/20 text-white py-2.5 px-4 flex items-center justify-center gap-2 text-sm hover:bg-white/5 transition-all">
                      <RotateCcw className="w-4 h-4" /> {t.retry}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{error}</div>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraScanner;
