import { useRef, useState, useCallback, useEffect } from 'react'
import { HiOutlineVideoCamera, HiOutlineStop, HiOutlineRefresh, HiOutlineUpload, HiOutlinePlay, HiOutlinePause } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function Video() {
    const [mode, setMode] = useState('select') // 'select', 'webcam', 'upload'
    const [isStreaming, setIsStreaming] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [detections, setDetections] = useState([])
    const [uniqueClasses, setUniqueClasses] = useState({})
    const [fps, setFps] = useState(0)
    const [error, setError] = useState(null)
    
    // Video upload states
    const [videoFile, setVideoFile] = useState(null)
    const [videoUrl, setVideoUrl] = useState(null)
    const [processedFrames, setProcessedFrames] = useState({}) // Store detections by time
    const [totalFrames, setTotalFrames] = useState(0)
    const [processedCount, setProcessedCount] = useState(0)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const overlayCanvasRef = useRef(null)
    const streamRef = useRef(null)
    const animationRef = useRef(null)
    const processingRef = useRef(false)
    
    // Start webcam
    const startWebcam = async () => {
        try {
            setError(null)
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'environment'
                } 
            })
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream
                setIsStreaming(true)
                setMode('webcam')
            }
        } catch (err) {
            console.error('Error accessing webcam:', err)
            setError('Could not access webcam. Please ensure camera permissions are granted.')
        }
    }
    
    // Stop webcam
    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }
        processingRef.current = false
        setIsStreaming(false)
        setIsProcessing(false)
        setDetections([])
    }
    
    // Capture and send frame for detection (webcam)
    const captureFrame = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !isStreaming) return
        
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        
        // Convert to blob
        canvas.toBlob(async (blob) => {
            if (!blob) return
            
            const formData = new FormData()
            formData.append('img', blob, 'frame.jpg')
            
            try {
                const startTime = performance.now()
                const response = await fetch('/api/image', {
                    method: 'POST',
                    body: formData
                })
                const data = await response.json()
                const endTime = performance.now()
                
                setFps(Math.round(1000 / (endTime - startTime)))
                setDetections(data.frame || [])
                
                // Track unique classes
                if (data.frame) {
                    setUniqueClasses(prev => {
                        const newClasses = { ...prev }
                        data.frame.forEach(det => {
                            newClasses[det.classId] = det.name
                        })
                        return newClasses
                    })
                }
            } catch (err) {
                console.error('Detection error:', err)
            }
        }, 'image/jpeg', 0.8)
    }, [isStreaming])
    
    // Processing loop for webcam
    useEffect(() => {
        let intervalId = null
        
        if (isProcessing && isStreaming && mode === 'webcam') {
            intervalId = setInterval(captureFrame, 200) // 5 FPS processing
        }
        
        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [isProcessing, isStreaming, captureFrame, mode])
    
    // Draw detections on canvas (webcam)
    useEffect(() => {
        if (!canvasRef.current || !videoRef.current || mode !== 'webcam') return
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const video = videoRef.current
        
        const draw = () => {
            if (!isStreaming) return
            
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            
            // Draw video frame
            ctx.drawImage(video, 0, 0)
            
            // Draw detections
            drawDetections(ctx, detections, canvas.width, canvas.height)
            
            animationRef.current = requestAnimationFrame(draw)
        }
        
        if (isStreaming) {
            draw()
        }
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isStreaming, detections, mode])
    
    // Handle video file upload
    const handleVideoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setVideoFile(file)
            setVideoUrl(URL.createObjectURL(file))
            setMode('upload')
            setProcessedFrames({})
            setProcessedCount(0)
            setTotalFrames(0)
        }
    }
    
    // Get video metadata when loaded
    const handleVideoLoaded = () => {
        if (videoRef.current) {
            const video = videoRef.current
            const duration = video.duration
            const estimatedFrames = Math.ceil(duration * 2) // Process at 2 FPS
            setTotalFrames(estimatedFrames)
            setFps(30)
        }
    }
    
    // Process video frame by frame (client-side extraction)
    const processVideo = async () => {
        if (!videoRef.current || !videoFile) return
        
        const video = videoRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        
        setIsProcessing(true)
        setError(null)
        processingRef.current = true
        
        const duration = video.duration
        const frameInterval = 0.5 // Process every 0.5 seconds (2 FPS)
        const newProcessedFrames = {}
        let processed = 0
        const totalToProcess = Math.ceil(duration / frameInterval)
        setTotalFrames(totalToProcess)
        
        // Process frames sequentially
        for (let time = 0; time < duration && processingRef.current; time += frameInterval) {
            try {
                // Seek to time
                video.currentTime = time
                await new Promise(resolve => {
                    video.onseeked = resolve
                })
                
                // Draw frame to canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                
                // Convert to blob and send to API
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/jpeg', 0.8)
                })
                
                if (!blob) continue
                
                const formData = new FormData()
                formData.append('img', blob, 'frame.jpg')
                
                const response = await fetch('/api/image', {
                    method: 'POST',
                    body: formData
                })
                const data = await response.json()
                
                // Store detections for this time
                const timeKey = time.toFixed(2)
                newProcessedFrames[timeKey] = data.frame || []
                
                // Update unique classes
                if (data.frame) {
                    setUniqueClasses(prev => {
                        const newClasses = { ...prev }
                        data.frame.forEach(det => {
                            newClasses[det.classId] = det.name
                        })
                        return newClasses
                    })
                }
                
                processed++
                setProcessedCount(processed)
                setProcessedFrames({ ...newProcessedFrames })
                
            } catch (err) {
                console.error('Frame processing error:', err)
            }
        }
        
        setIsProcessing(false)
        processingRef.current = false
        
        // Reset video to start
        video.currentTime = 0
    }
    
    // Stop processing
    const stopProcessing = () => {
        processingRef.current = false
        setIsProcessing(false)
    }
    
    // Draw overlay detections for uploaded video
    useEffect(() => {
        if (mode !== 'upload' || !overlayCanvasRef.current || !videoRef.current) return
        
        const canvas = overlayCanvasRef.current
        const ctx = canvas.getContext('2d')
        const video = videoRef.current
        
        const updateOverlay = () => {
            if (!video.videoWidth) return
            
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            // Find closest processed frame
            let closestDetections = []
            
            // Find the nearest processed frame
            const times = Object.keys(processedFrames).map(Number).sort((a, b) => a - b)
            for (let i = times.length - 1; i >= 0; i--) {
                if (times[i] <= currentTime) {
                    closestDetections = processedFrames[times[i].toFixed(2)] || []
                    break
                }
            }
            
            setDetections(closestDetections)
            drawDetections(ctx, closestDetections, canvas.width, canvas.height)
        }
        
        updateOverlay()
    }, [currentTime, processedFrames, mode])
    
    // Handle video time update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }
    
    // Toggle video playback
    const togglePlayback = () => {
        if (videoRef.current) {
            if (isVideoPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsVideoPlaying(!isVideoPlaying)
        }
    }
    
    // Draw detections helper
    const drawDetections = (ctx, dets, width, height) => {
        dets.forEach(det => {
            const x = det.box[0] * width
            const y = det.box[1] * height
            const w = (det.box[2] - det.box[0]) * width
            const h = (det.box[3] - det.box[1]) * height
            
            // Draw box
            ctx.strokeStyle = det.color
            ctx.lineWidth = 3
            ctx.strokeRect(x, y, w, h)
            
            // Draw glow effect
            ctx.shadowColor = det.color
            ctx.shadowBlur = 10
            ctx.strokeRect(x, y, w, h)
            ctx.shadowBlur = 0
            
            // Draw label background
            const label = `${det.name} ${Math.round(det.confidence * 100)}%`
            ctx.font = 'bold 14px Inter, sans-serif'
            const textWidth = ctx.measureText(label).width
            
            ctx.fillStyle = det.color
            ctx.fillRect(x, y - 24, textWidth + 12, 24)
            
            // Draw label text
            ctx.fillStyle = 'white'
            ctx.fillText(label, x + 6, y - 7)
        })
    }
    
    const resetAll = () => {
        stopWebcam()
        stopProcessing()
        setMode('select')
        setVideoFile(null)
        setVideoUrl(null)
        setProcessedFrames({})
        setProcessedCount(0)
        setTotalFrames(0)
        setCurrentTime(0)
        setIsVideoPlaying(false)
        setDetections([])
        setUniqueClasses({})
        setError(null)
    }
    
    const progress = totalFrames > 0 ? Math.round((processedCount / totalFrames) * 100) : 0
    
    return (
        <div className="min-h-full p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold gradient-text mb-2">Video Detection</h1>
                <p className="text-slate-400">Use webcam or upload video for real-time detection</p>
            </div>
            
            {error && (
                <div className="max-w-4xl mx-auto mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300">
                    {error}
                </div>
            )}
            
            {mode === 'select' ? (
                /* Mode Selection */
                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={startWebcam}
                        className="glass-card p-8 rounded-2xl flex flex-col items-center gap-4 hover:bg-white/5 transition-all card-hover"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <HiOutlineVideoCamera className="text-4xl text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Live Webcam</h3>
                        <p className="text-slate-400 text-center text-sm">
                            Use your camera for real-time object detection
                        </p>
                    </button>
                    
                    <label className="glass-card p-8 rounded-2xl flex flex-col items-center gap-4 hover:bg-white/5 transition-all card-hover cursor-pointer">
                        <input 
                            type="file" 
                            accept="video/*" 
                            hidden 
                            onChange={handleVideoUpload}
                        />
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                            <HiOutlineUpload className="text-4xl text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Upload Video</h3>
                        <p className="text-slate-400 text-center text-sm">
                            Process a video file for object detection
                        </p>
                    </label>
                </div>
            ) : (
                /* Detection View */
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    {/* Video/Canvas Container */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        {/* Controls Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                {isProcessing && (
                                    <div className="flex items-center gap-2">
                                        <div className="status-indicator processing"></div>
                                        <span className="text-yellow-400 text-sm font-medium">
                                            Processing {progress}%
                                        </span>
                                    </div>
                                )}
                                {!isProcessing && processedCount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="status-indicator live"></div>
                                        <span className="text-green-400 text-sm font-medium">
                                            {processedCount} frames processed
                                        </span>
                                    </div>
                                )}
                                {mode === 'webcam' && fps > 0 && (
                                    <span className="text-slate-400 text-sm">~{fps} FPS</span>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                {mode === 'webcam' && (
                                    <>
                                        {!isProcessing ? (
                                            <button
                                                onClick={() => setIsProcessing(true)}
                                                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                                            >
                                                <HiOutlinePlay />
                                                Start Detection
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setIsProcessing(false)}
                                                className="glass-card-light px-4 py-2 rounded-xl text-red-400 flex items-center gap-2"
                                            >
                                                <HiOutlineStop />
                                                Stop
                                            </button>
                                        )}
                                    </>
                                )}
                                
                                {mode === 'upload' && (
                                    <>
                                        {!isProcessing && processedCount === 0 && (
                                            <button
                                                onClick={processVideo}
                                                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                                            >
                                                <HiOutlinePlay />
                                                Analyze Video
                                            </button>
                                        )}
                                        
                                        {isProcessing && (
                                            <button
                                                onClick={stopProcessing}
                                                className="glass-card-light px-4 py-2 rounded-xl text-red-400 flex items-center gap-2"
                                            >
                                                <HiOutlineStop />
                                                Stop
                                            </button>
                                        )}
                                        
                                        {!isProcessing && processedCount > 0 && (
                                            <button
                                                onClick={togglePlayback}
                                                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                                            >
                                                {isVideoPlaying ? <HiOutlinePause /> : <HiOutlinePlay />}
                                                {isVideoPlaying ? 'Pause' : 'Play'}
                                            </button>
                                        )}
                                    </>
                                )}
                                
                                <button
                                    onClick={resetAll}
                                    className="glass-card-light px-4 py-2 rounded-xl text-slate-300 hover:text-white flex items-center gap-2"
                                >
                                    <HiOutlineRefresh />
                                </button>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        {isProcessing && mode === 'upload' && (
                            <div className="px-4 py-2 border-b border-white/10">
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Processed {processedCount} of {totalFrames} frames
                                </p>
                            </div>
                        )}
                        
                        {/* Video Display */}
                        <div className="relative bg-slate-900 aspect-video">
                            {mode === 'webcam' && (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="absolute inset-0 w-full h-full object-contain opacity-0"
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                </>
                            )}
                            
                            {mode === 'upload' && videoUrl && (
                                <>
                                    <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        className="absolute inset-0 w-full h-full object-contain"
                                        onLoadedMetadata={handleVideoLoaded}
                                        onTimeUpdate={handleTimeUpdate}
                                        onPlay={() => setIsVideoPlaying(true)}
                                        onPause={() => setIsVideoPlaying(false)}
                                        onEnded={() => setIsVideoPlaying(false)}
                                        muted
                                    />
                                    <canvas
                                        ref={overlayCanvasRef}
                                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                    />
                                </>
                            )}
                        </div>
                        
                        {/* Video Scrubber for uploaded videos */}
                        {mode === 'upload' && videoRef.current && processedCount > 0 && (
                            <div className="p-4 border-t border-white/10">
                                <input
                                    type="range"
                                    min={0}
                                    max={videoRef.current?.duration || 100}
                                    step={0.1}
                                    value={currentTime}
                                    onChange={(e) => {
                                        const time = parseFloat(e.target.value)
                                        if (videoRef.current) {
                                            videoRef.current.currentTime = time
                                        }
                                        setCurrentTime(time)
                                    }}
                                    className="w-full accent-indigo-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{detections.length} detections</span>
                                    <span>{formatTime(videoRef.current?.duration || 0)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Detected Classes */}
                    {Object.keys(uniqueClasses).length > 0 && (
                        <div className="glass-card p-4 rounded-2xl animate-fadeInUp">
                            <h3 className="text-lg font-semibold text-white mb-4">Detected Items</h3>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(uniqueClasses).map(([id, name]) => (
                                    <Link
                                        key={id}
                                        to={`/tools/${id}`}
                                        className="glass-card-light px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-all"
                                    >
                                        <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                                            {id}
                                        </span>
                                        <span className="text-white font-medium capitalize">{name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Helper to format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}
