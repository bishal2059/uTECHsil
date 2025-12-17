export const BoundingBox = ({ relativePos, detection, onClick }) => {
    if (!relativePos) return null;
    
    return (
        <>
            {/* Label */}
            <span
                className="absolute px-2 py-0.5 rounded-t-md text-xs font-medium text-white z-10"
                style={{
                    backgroundColor: detection.color,
                    left: `${relativePos.left + detection.box[0] * relativePos.width}px`,
                    bottom: `${relativePos.bottom + (1 - detection.box[1]) * relativePos.height}px`,
                    boxShadow: `0 0 10px ${detection.color}`,
                }}
            >
                {detection.name} ({Math.round(detection.confidence * 100)}%)
            </span>
            
            {/* Bounding Box */}
            <div
                className="absolute border-2 rounded-md cursor-pointer transition-all duration-200 hover:border-4 detection-box"
                onClick={() => onClick(detection.classId)}
                style={{
                    borderColor: detection.color,
                    left: `${relativePos.left + detection.box[0] * relativePos.width}px`,
                    top: `${relativePos.top + detection.box[1] * relativePos.height}px`,
                    right: `${relativePos.right + (1 - detection.box[2]) * relativePos.width}px`,
                    bottom: `${relativePos.bottom + (1 - detection.box[3]) * relativePos.height}px`,
                    boxShadow: `0 0 15px ${detection.color}40`,
                }}
            />
        </>
    )
}
