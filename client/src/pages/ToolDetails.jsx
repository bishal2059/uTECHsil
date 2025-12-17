import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineArrowLeft, HiOutlineShoppingCart, HiOutlinePhotograph } from 'react-icons/hi'

import { toolsList } from '../../data/tools'

const ToolDetails = () => {
    const [expandedSections, setExpandedSections] = useState({
        description: true,
        uses: true,
        materials: false,
        gallery: false
    })
    const { id } = useParams()
    const tool = toolsList[id]

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    if (!tool) {
        return (
            <div className="min-h-full flex flex-col items-center justify-center p-6">
                <div className="glass-card p-8 rounded-2xl text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Tool Not Found</h1>
                    <p className="text-slate-400 mb-6">The tool you're looking for doesn't exist in our database.</p>
                    <Link to="/tools" className="btn-primary inline-flex items-center gap-2 text-white">
                        <HiOutlineArrowLeft />
                        Back to Tools
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-full p-4 md:p-6">
            {/* Back Button */}
            <Link
                to="/tools"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <HiOutlineArrowLeft />
                <span>Back to Tools</span>
            </Link>

            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="glass-card rounded-2xl overflow-hidden mb-6">
                    {/* Main Image */}
                    <div className="relative h-64 md:h-80">
                        <img
                            src={tool.image}
                            alt={tool.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                        
                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">
                                    {id}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
                                    {tool.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="flex flex-col gap-4">
                    {/* Description Section */}
                    <CollapsibleSection
                        title="Description"
                        icon="📖"
                        isExpanded={expandedSections.description}
                        onToggle={() => toggleSection('description')}
                    >
                        <p className="text-slate-300 leading-relaxed">{tool.description}</p>
                    </CollapsibleSection>

                    {/* Uses Section */}
                    <CollapsibleSection
                        title="Common Uses"
                        icon="🔧"
                        isExpanded={expandedSections.uses}
                        onToggle={() => toggleSection('uses')}
                    >
                        <div className="flex flex-wrap gap-2">
                            {tool.uses?.map((use, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 capitalize"
                                >
                                    {use}
                                </span>
                            ))}
                        </div>
                    </CollapsibleSection>

                    {/* Materials Section */}
                    <CollapsibleSection
                        title="Materials Used"
                        icon="🏭"
                        isExpanded={expandedSections.materials}
                        onToggle={() => toggleSection('materials')}
                    >
                        <div className="flex flex-wrap gap-2">
                            {tool.material?.map((mat, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 capitalize"
                                >
                                    {mat}
                                </span>
                            ))}
                        </div>
                    </CollapsibleSection>

                    {/* Gallery Section */}
                    {tool.subImages && tool.subImages.length > 0 && (
                        <CollapsibleSection
                            title="Gallery"
                            icon="🖼️"
                            isExpanded={expandedSections.gallery}
                            onToggle={() => toggleSection('gallery')}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {tool.subImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img
                                            src={img}
                                            alt={`${tool.name} ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/200?text=Image'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <HiOutlinePhotograph className="text-3xl text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* Buy Button */}
                    <button className="btn-primary w-full flex items-center justify-center gap-3 text-white py-4">
                        <HiOutlineShoppingCart className="text-xl" />
                        <span className="text-lg font-semibold">Buy Now</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

const CollapsibleSection = ({ title, icon, isExpanded, onToggle, children }) => (
    <div className="glass-card rounded-2xl overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
            <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
            {isExpanded ? (
                <HiOutlineChevronUp className="text-xl text-slate-400" />
            ) : (
                <HiOutlineChevronDown className="text-xl text-slate-400" />
            )}
        </button>
        
        {isExpanded && (
            <div className="px-4 pb-4 animate-fadeInUp">
                {children}
            </div>
        )}
    </div>
)

export default ToolDetails
