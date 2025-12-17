import { Link, useLocation } from 'react-router-dom'
import { HiOutlineHome, HiOutlinePhotograph, HiOutlineVideoCamera, HiOutlineInformationCircle } from 'react-icons/hi'

export default function Nav() {
    const location = useLocation()
    
    const navItems = [
        { path: '/', icon: HiOutlineHome, label: 'Home' },
        { path: '/image', icon: HiOutlinePhotograph, label: 'Image' },
        { path: '/video', icon: HiOutlineVideoCamera, label: 'Video' },
        { path: '/tools', icon: HiOutlineInformationCircle, label: 'Info' },
    ]
    
    return (
        <div className="glass-card mx-4 mb-4 px-2 py-3">
            <div className="flex flex-row justify-around items-center">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon
                    
                    return (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                                isActive 
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Icon className="text-2xl" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
