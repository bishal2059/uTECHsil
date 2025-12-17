import { HiOutlineX, HiOutlineInformationCircle, HiOutlineExternalLink } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { toolsList } from '../../data/tools'

export default function InfoList({ classId, handleBack }) {
    const tool = toolsList[classId]
    
    if (!tool) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <p>Tool information not found</p>
                <button 
                    onClick={handleBack}
                    className="mt-4 btn-secondary text-sm py-2 px-4"
                >
                    Go Back
                </button>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col gap-4 animate-fadeInUp">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <HiOutlineInformationCircle className="text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white capitalize">
                        {tool.name}
                    </h2>
                </div>
                <button
                    onClick={handleBack}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                    <HiOutlineX className="text-xl" />
                </button>
            </div>
            
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden">
                <img 
                    src={tool.image} 
                    alt={tool.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </div>
            
            {/* Description */}
            <p className="text-slate-300 leading-relaxed">
                {tool.description}
            </p>
            
            {/* Uses */}
            {tool.uses && tool.uses.length > 0 && (
                <div>
                    <h4 className="text-sm text-slate-400 mb-2">Common Uses</h4>
                    <div className="flex flex-wrap gap-2">
                        {tool.uses.map((use, idx) => (
                            <span 
                                key={idx}
                                className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm capitalize"
                            >
                                {use}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {/* View More Link */}
            <Link 
                to={`/tools/${classId}`}
                className="btn-primary text-center text-white flex items-center justify-center gap-2"
            >
                View Full Details
                <HiOutlineExternalLink />
            </Link>
        </div>
    )
}
