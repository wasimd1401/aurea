import { useState, useRef, useCallback } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { analyzeProductImage } from '@/lib/nvidia-ai'
import { Camera, Upload, X, Loader2, RotateCcw, CheckCircle2 } from 'lucide-react'

interface CameraScannerProps {
  onClose: () => void
  onResult: (result: {
    name: string
    category: string
    unit: string
    storageZone: string
    shelfLifeDays: number
    confidence: number
  }) => void
}

export default function CameraScanner({ onClose, onResult }: CameraScannerProps) {
  const { lang } = useLanguage()
  const [mode, setMode] = useState<'choose' | 'camera' | 'analyzing' | 'result'>('choose')
  const [imageData, setImageData] = useState<string | null>(null)
  const [result, setResult] = useState<Awaited<ReturnType<typeof analyzeProductImage>> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  async function startCamera() {
    setMode('camera')
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setError(lang === 'es' ? 'No se pudo acceder a la cámara' : 'Could not access camera')
      setMode('choose')
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    setImageData(base64)
    stopCamera()
    analyzeImage(base64)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      setImageData(base64)
      analyzeImage(base64)
    }
    reader.readAsDataURL(file)
  }

  async function analyzeImage(base64: string) {
    setMode('analyzing')
    setError(null)
    try {
      const res = await analyzeProductImage(base64)
      setResult(res)
      setMode('result')
    } catch (err) {
      setError(lang === 'es' ? 'Error al analizar imagen' : 'Error analyzing image')
      setMode('choose')
    }
  }

  function handleAccept() {
    if (result) {
      onResult({
        name: result.name,
        category: result.category,
        unit: result.unit,
        storageZone: result.storageZone,
        shelfLifeDays: result.shelfLifeDays,
        confidence: result.confidence,
      })
    }
  }

  function handleRetry() {
    setImageData(null)
    setResult(null)
    setError(null)
    setMode('choose')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">
            {lang === 'es' ? 'Identificar producto' : 'Identify product'}
          </h2>
          <button onClick={() => { stopCamera(); onClose() }} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Choose mode */}
          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">
                {lang === 'es'
                  ? 'Toma una foto o sube una imagen del producto'
                  : 'Take a photo or upload a product image'}
              </p>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={startCamera}
                  className="flex flex-col items-center gap-3 p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                >
                  <Camera className="w-10 h-10 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {lang === 'es' ? 'Cámara' : 'Camera'}
                  </span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-3 p-6 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition"
                >
                  <Upload className="w-10 h-10 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    {lang === 'es' ? 'Subir imagen' : 'Upload image'}
                  </span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-400 text-center">
                {lang === 'es'
                  ? 'Powered by Kimi k2.5 (NVIDIA NIM)'
                  : 'Powered by Kimi k2.5 (NVIDIA NIM)'}
              </p>
            </div>
          )}

          {/* Camera */}
          {mode === 'camera' && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-white/30 rounded-xl pointer-events-none" />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <button
                onClick={capturePhoto}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                <Camera className="w-5 h-5" />
                {lang === 'es' ? 'Capturar' : 'Capture'}
              </button>
            </div>
          )}

          {/* Analyzing */}
          {mode === 'analyzing' && (
            <div className="flex flex-col items-center gap-4 py-8">
              {imageData && (
                <img src={`data:image/jpeg;base64,${imageData}`} className="w-32 h-32 object-cover rounded-xl" />
              )}
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-sm text-gray-500">
                {lang === 'es' ? 'Analizando producto con IA...' : 'Analyzing product with AI...'}
              </p>
            </div>
          )}

          {/* Result */}
          {mode === 'result' && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {lang === 'es' ? 'Producto identificado' : 'Product identified'}
                  {' '}({Math.round(result.confidence * 100)}%)
                </span>
              </div>

              {imageData && (
                <img src={`data:image/jpeg;base64,${imageData}`} className="w-full h-40 object-cover rounded-xl" />
              )}

              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{lang === 'es' ? 'Nombre' : 'Name'}</span>
                  <span className="text-sm font-medium text-gray-900">{result.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{lang === 'es' ? 'Categoría' : 'Category'}</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{result.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{lang === 'es' ? 'Unidad' : 'Unit'}</span>
                  <span className="text-sm font-medium text-gray-900">{result.unit}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{lang === 'es' ? 'Zona' : 'Zone'}</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{result.storageZone}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">{lang === 'es' ? 'Vida útil' : 'Shelf life'}</span>
                  <span className="text-sm font-medium text-gray-900">{result.shelfLifeDays} {lang === 'es' ? 'días' : 'days'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  {lang === 'es' ? 'Reintentar' : 'Retry'}
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {lang === 'es' ? 'Usar producto' : 'Use product'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
