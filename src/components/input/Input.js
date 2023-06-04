import React from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import './Input.css'

function Input(props) {
    const { size = 'medium',loader, ...rest } = props
    return (
        <>
        { loader === 'loading' ? 
        (<div className='inputcontainer'>
            <input className={`input ${size}`} {...rest} onBlur={props.chooseMessage} />
            <div className="icon-container">
                <i className="loader"></i>
            </div>
        </div>): loader === 'error'? (
            <div className='inputcontainer'>
                <input className={`input ${size}`} {...rest} onBlur={props.chooseMessage} />
            <div className="icon-container">
                <XMarkIcon className='w-6 error-label'/>
            </div>
            </div>
        ) :(<input className={`input ${size}`} {...rest} onBlur={props.chooseMessage} />)}
        </>
    )
}

export default Input