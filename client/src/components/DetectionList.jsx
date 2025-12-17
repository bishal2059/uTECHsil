import { HiOutlineEye, HiOutlineEyeOff, HiOutlineInformationCircle } from 'react-icons/hi'

export default function DetectionList({ items, handleClick, onInfo }) {
    if (!items || items?.length === 0)
        return (
            <div className="w-full text-center py-8 text-slate-400">
                <p>No items detected</p>
            </div>
        )

    return (
        <div className="flex flex-wrap gap-3">
            {items?.map((item, index) => (
                <div
                    key={index}
                    className={`glass-card-light flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 ${
                        item.show ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500 opacity-60'
                    }`}
                >
                    <div
                        onClick={() => onInfo(item.classId)}
                        className="cursor-pointer flex items-center gap-2 group"
                    >
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                            {item.classId}
                        </span>
                        <span className="text-white font-medium capitalize group-hover:text-indigo-400 transition-colors">
                            {item.name}
                        </span>
                        <HiOutlineInformationCircle className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    
                    <button
                        onClick={() => handleClick(item.classId)}
                        className={`p-2 rounded-lg transition-all ${
                            item.show 
                                ? 'text-green-400 hover:bg-green-500/20' 
                                : 'text-red-400 hover:bg-red-500/20'
                        }`}
                    >
                        {item.show ? (
                            <HiOutlineEye className="text-lg" />
                        ) : (
                            <HiOutlineEyeOff className="text-lg" />
                        )}
                    </button>
                </div>
            ))}
        </div>
    )
}
