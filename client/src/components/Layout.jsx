import { Outlet } from 'react-router'
import Nav from './Nav'

const Layout = () => {
    return (
        <div className="flex flex-col w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <main className="flex-1 pb-24 relative z-10 overflow-auto">
                <Outlet />
            </main>
            
            <footer className="fixed bottom-0 left-0 right-0 z-50">
                <Nav />
            </footer>
        </div>
    )
}

export default Layout
