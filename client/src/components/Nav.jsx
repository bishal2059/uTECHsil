import { Link } from 'react-router-dom'
import { CiHome,CiCircleInfo } from "react-icons/ci";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";


export default function Nav() {
    return (
        <div className="flex flex-row justify-around h-full items-center ">
            <Link to={'/'} className="flex flex-col items-center"> 
                <CiHome className="text-4xl" />
                <span>Home</span>
            </Link>
            <Link to={'/image'} className="flex flex-col items-center">
                <HiOutlineMagnifyingGlass className="text-4xl" />
                <span>Search</span>
            </Link>
            {/* <Link to={'/video'} className="flex flex-col items-center">
                <AiOutlineVideoCamera className="text-4xl" />
                <span>Video</span>
            </Link> */}
            <Link to={'/tools'} className="flex flex-col items-center">
                <CiCircleInfo className="text-4xl" />
                <span>Info</span>
            </Link>
        </div>
    )
}
