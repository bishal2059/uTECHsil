import { Link } from 'react-router-dom'
import { toolsList } from '../../data/tools'
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi'

const Tools = () => {
    return (
        <div className="min-h-full p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-light mb-4">
                    <HiOutlineSparkles className="text-indigo-400" />
                    <span className="text-sm text-slate-300">Encyclopedia</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Traditional Tools</h1>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Explore our collection of traditional Nepali utensils and their cultural significance
                </p>
            </div>

            {/* Tools Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(toolsList).map(toolId => {
                    const tool = toolsList[toolId]
                    return (
                        <Link
                            key={toolId}
                            to={`/tools/${toolId}`}
                            className="glass-card rounded-2xl overflow-hidden card-hover group"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={tool.image}
                                    alt={tool.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                
                                {/* ID Badge */}
                                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-indigo-500/80 backdrop-blur flex items-center justify-center text-white font-bold text-sm">
                                    {toolId}
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-xl font-semibold text-white mb-2 capitalize group-hover:text-indigo-400 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                    {tool.description}
                                </p>
                                
                                {/* Uses Tags */}
                                {tool.uses && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {tool.uses.slice(0, 3).map((use, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 rounded-full bg-white/5 text-slate-400 text-xs capitalize"
                                            >
                                                {use}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                {/* View More */}
                                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:gap-3 transition-all">
                                    <span>View Details</span>
                                    <HiOutlineArrowRight />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default Tools
