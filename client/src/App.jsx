import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import ImagePage from './pages/Image'
import ToolDetails from './pages/ToolDetails'
import Tools from './pages/Tools'
import './index.css'

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<HomePage />} />
                    <Route path="image" element={<ImagePage />} />
                    <Route path="tools" element={<Tools />} />
                    <Route path="tools/:id" element={<ToolDetails />} />
                </Route>
            </Routes>
        </>
    )
}