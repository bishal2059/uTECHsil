import UploadCard from '../components/UploadCard'
import { HiOutlineRefresh, HiOutlineTrash, HiOutlineSparkles, HiOutlineEye } from 'react-icons/hi'
import { useRef, useState } from 'react'

import DetectionList from '../components/DetectionList'
import InfoList from '../components/InfoList'
import { Link } from 'react-router-dom'
import { BoundingBox } from '../components/BoundingBox'

export default function Image() {
    const [targetImage, setTargetImage] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const [predicting, setPredicting] = useState(false)
    const [predictedClasses, setPredictedClasses] = useState(null)
    const [detectedItems, setDetectedItems] = useState([])
    const [detected, setDetected] = useState(false)
    const [noInfo, setNoInfo] = useState(null)
    const [inferedTools, setInferedTools] = useState({
        name: null,
        id: null,
    })

    const hideClass = id => {
        setPredictedClasses(oldData => {
            const newData = {}
            for (let i in oldData) {
                const d = oldData[i]
                newData[d.classId] = {
                    classId: d.classId,
                    name: d.name,
                    show: d.classId == id ? !d.show : d.show,
                }
            }
            return newData
        })
    }

    const handleChange = e => {
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = r => {
            setTargetImage(r?.target?.result)
            setImageFile(e.target.files[0])
        }
    }

    function handleSubmit() {
        setPredicting(true)
        const data = new FormData()
        data.append('img', imageFile)
        fetch('/api/image', {
            method: 'POST',
            body: data,
        })
            .then(r => r.json())
            .then(r => {
                const tempPredictedClass = {}
                for (let i of r.frame) {
                    tempPredictedClass[i.classId] = {
                        classId: i.classId,
                        name: i.name,
                        show: true,
                    }
                }
                console.log(r.frame)
                setPredictedClasses(tempPredictedClass)
                setDetectedItems(r.frame)
                setDetected(true)
                setInferedTools({name:r.frame[0]?.['name'],id:r.frame[0]?.['classId']})
            })
            .catch(e => {
                console.error(e)
            })
            .finally(() => setPredicting(false))
    }

    const parentRef = useRef(null)
    const imageRef = useRef(null)

    const [bounding, setBounding] = useState(null)

    function bounds() {
        const p = parentRef.current?.getBoundingClientRect()
        const i = imageRef.current?.getBoundingClientRect()

        if (!p || !i) setBounding(null)
        else
            setBounding({
                left: i.left - p.left,
                right: p.right - i.right,
                top: i.top - p.top,
                bottom: p.bottom - i.bottom,
                width: i.width,
                height: i.height,
            })
    }

    const handleClear = () => {
        setTargetImage(null)
        setImageFile(null)
        setPredictedClasses(null)
        setDetectedItems([])
        setDetected(false)
        setNoInfo(null)
    }

    return (
        <div className="min-h-full p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold gradient-text mb-2">Image Detection</h1>
                <p className="text-slate-400">Upload an image to identify traditional items</p>
            </div>

            {targetImage === null ? (
                <UploadCard
                    handleChange={handleChange}
                    accept="image/*"
                    title="Upload Image"
                    subtitle="Drag and drop an image of a traditional utensil"
                />
            ) : (
                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                    {/* Image Preview Section */}
                    <div className="glass-card p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <HiOutlineEye className="text-indigo-400" />
                                Preview
                            </h2>
                            <div className="flex gap-2">
                                {!predicting ? (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 btn-primary text-sm py-2 px-4"
                                    >
                                        <HiOutlineSparkles />
                                        Detect
                                    </button>
                                ) : (
                                    <button className="flex items-center gap-2 btn-primary text-sm py-2 px-4 opacity-70 cursor-not-allowed">
                                        <div className="spinner w-4 h-4 border-2"></div>
                                        Processing...
                                    </button>
                                )}
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-2 glass-card-light px-4 py-2 rounded-xl text-slate-300 hover:text-red-400 transition-colors"
                                >
                                    <HiOutlineTrash />
                                </button>
                            </div>
                        </div>
                        
                        <div className="relative rounded-xl overflow-hidden bg-slate-900/50" ref={parentRef}>
                            <img
                                src={targetImage}
                                className="max-h-[50vh] mx-auto"
                                onLoad={bounds}
                                ref={imageRef}
                                alt="Uploaded image"
                            />
                            {detected && bounding && (
                                <>
                                    {detectedItems.map((item, idx) => {
                                        if (predictedClasses[item.classId]?.show)
                                            return (
                                                <BoundingBox
                                                    key={idx}
                                                    detection={item}
                                                    onClick={setNoInfo}
                                                    relativePos={bounding}
                                                />
                                            )
                                        return null
                                    })}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Detection Results */}
                    {detected && (
                        <div className="glass-card p-4 rounded-2xl animate-fadeInUp">
                            {noInfo === null ? (
                                <div className="flex flex-col gap-4">
                                    {/* Primary Detection */}
                                    {inferedTools?.name && (
                                        <Link
                                            to={`/tools/${inferedTools?.id}`}
                                            className="glass-card-light p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all group"
                                        >
                                            <div>
                                                <span className="text-slate-400 text-sm">Primary Detection</span>
                                                <h3 className="text-xl font-semibold text-white capitalize">
                                                    {inferedTools?.name}
                                                </h3>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <HiOutlineSparkles className="text-white" />
                                            </div>
                                        </Link>
                                    )}
                                    
                                    {/* All Detections */}
                                    <div>
                                        <h4 className="text-sm text-slate-400 mb-3">All Detected Items</h4>
                                        <DetectionList
                                            items={Object.values(predictedClasses || {})}
                                            onInfo={setNoInfo}
                                            handleClick={hideClass}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <InfoList
                                    classId={noInfo}
                                    handleBack={() => setNoInfo(null)}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
