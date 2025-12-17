/* eslint-disable react/prop-types */
import { useState, useRef } from 'react'
import { HiOutlineCloudUpload, HiOutlinePhotograph, HiOutlineVideoCamera } from 'react-icons/hi'

export default function UploadCard({ handleChange, image, accept, title, subtitle }) {
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef(null)
    
    const isVideo = accept?.includes('video')
    
    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }
    
    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }
    
    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        
        const files = e.dataTransfer.files
        if (files.length > 0) {
            const event = { target: { files } }
            handleChange(event)
        }
    }
    
    return (
        <div className="h-full w-full flex items-center justify-center p-6">
            <input
                type="file"
                accept={accept}
                hidden
                ref={inputRef}
                id="fileUpload"
                onChange={e => handleChange(e)}
            />
            
            <div 
                className={`upload-dropzone w-full max-w-lg ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                {/* Icon */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full"></div>
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        {isVideo ? (
                            <HiOutlineVideoCamera className="text-4xl text-white" />
                        ) : (
                            <HiOutlinePhotograph className="text-4xl text-white" />
                        )}
                    </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2">
                    {title || (isVideo ? 'Upload Video' : 'Upload Image')}
                </h3>
                
                {/* Subtitle */}
                <p className="text-slate-400 text-center mb-6 max-w-xs">
                    {subtitle || 'Drag and drop your file here, or click to browse'}
                </p>
                
                {/* Upload Button */}
                <div className="flex items-center gap-2 btn-primary text-white">
                    <HiOutlineCloudUpload className="text-xl" />
                    <span>Choose File</span>
                </div>
                
                {/* Supported formats */}
                <p className="text-xs text-slate-500 mt-4">
                    {isVideo ? 'Supports: MP4, WebM, AVI' : 'Supports: JPG, PNG, WebP'}
                </p>
            </div>
        </div>
    )
}
