import React                          from 'react'
import { useNavigate }                from 'react-router-dom'
import { ArrowLeftIcon, 
       }                              from '@heroicons/react/24/outline'


const Header = ({ label, isHideBackButton, onBackBtnClick, backUrl=''  }) => {
  const navigate = useNavigate();

  const onBackClick = () => {
    if (onBackBtnClick) {
      onBackBtnClick()
    }
    if(backUrl){
      navigate(backUrl)
    }else{
      navigate("/")
    }
  }

  return (
    <div className="flex justify-between items-center px-4 py-3 bookmark-bg">
      {isHideBackButton 
        ? <div className="flex justify-start items-center cursor-pointer">
            <span className="text-black text-sm ml-1">{label}</span>
          </div>
        : <div className="flex justify-start items-center cursor-pointer" onClick={onBackClick}>
            <ArrowLeftIcon className="h-4 w-4 text-black" aria-hidden="true" />
            <span className="text-black text-sm ml-1">{label}</span>
          </div>
      }
    </div>
  )
}

export default Header