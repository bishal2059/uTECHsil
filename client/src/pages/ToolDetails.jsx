import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi'

import { toolsList } from '../../data/tools'
import classes from './ToolDetails.module.css'

const ToolDetails = () => {
    const [collapse, setCollapse] = useState([true, true, true, false, false, false])
    let { id } = useParams()

    const updateCol = idx => {
        let update = [...collapse]
        update[idx] = !update[idx]
        setCollapse(update)
    }

    if (!toolsList[id])
        return (
            <div>
                <Link className="text-sm bold text-blue-600" to={'/tools'}>
                    {'<< Back to All Culture'}
                </Link>
                <h1 className="text-2xl text-center mt-20 bold">Not found</h1>{' '}
            </div>
        )
    return (
        <div className="flex flex-col h-full w-full justify-start gap-y-4">
            <div className={classes.main} 
>
                <h1 className="text-3xl font-bold text-center pb-4">
                    {toolsList[id]['name']}
                </h1>
            </div>
            <div className="flex flex-col gap-y-2 rounded-md transition duration-300 overflow-scroll h-fit">
                <div className="flex flex-col gap-y-4">
                    <div className="section flex-shrink-0">
                        <img src={toolsList[id]['image']} alt="Image not found" className={classes.pic}/>
                        <h2
                            className="cursor-pointer flex items-center justify-between px-3 py-1 shadow-md"
                            onClick={e => updateCol(1)}
                        >
                            <span className='text-2xl' >Description</span> {collapse[1] ? <BiSolidUpArrow size='1.5em'/> : <BiSolidDownArrow size='1.5em'/>}
                        </h2>
                        {collapse[1] && <p className={classes.disp}>{toolsList[id]['description']}</p>}                    </div>
                    <div className="section">
                        <h2
                            className="cursor-pointer flex items-center justify-between px-3 py-1 shadow-md"
                            onClick={e => updateCol(2)}
                        >
                            <span className='text-2xl'>Uses</span> {collapse[2] ? <BiSolidUpArrow size='1.5em'/> : <BiSolidDownArrow size='1.5em'/>}
                        </h2>
                        {collapse[2]  &&
                            toolsList[id]['uses'].map(a => <li> {a }</li>
                        )}
                    </div>
                    <div className="section">
                        <h2
                            className="cursor-pointer flex items-center justify-between px-3 py-1 shadow-md"
                            onClick={e => updateCol(4)}
                        >
                            <span className='text-2xl'>Materials used to craft</span> {collapse[4] ? <BiSolidUpArrow size='1.5em'/> : <BiSolidDownArrow size='1.5em'/>}
                        </h2>
                        {collapse[4] && (
                            <>
                                {toolsList[id]['material'].map(a => <li> {a }</li>) }
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <button className={classes.buy}> Buy Now</button>
                </div>
            </div>
        </div>
    )
}

export default ToolDetails
