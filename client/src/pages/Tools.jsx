import { Link } from 'react-router-dom'
import { toolsList } from '../../data/tools'
import classes from './Tools.module.css'

const Tools = () => {
    return (
        <div>
            <h1 className="text-3xl text-center font-bold">Traditional Tools</h1>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {Object.keys(toolsList).map(tools => {
                    return (
                        <div key={tools} className={classes.main}>
                                <Link to={`/tools/${tools}`} className="w-full">
                            <div className="rounded overflow-hidden shadow-lg">
                                <img
                                    className={classes.pic}
                                    src={toolsList[tools]['image']}
                                    alt={toolsList[tools]['name']}
                                />
                                <div className="px-6 py-4">
                                    <div className="font-bold text-xl mb-2 ">
                                        {toolsList[tools]['name']}
                                    </div>
                                    <p className="text-gray-700 text-base text-ellipsis h-20 overflow-hidden">
                                       <div className={classes.discp}> {toolsList[tools]['description']}
                                    </div>
                                    </p>
                                </div>
                            </div>
                                    </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Tools
