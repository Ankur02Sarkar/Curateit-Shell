import "./CommonHeader.css"
import React, { useState, useEffect }       from 'react'
import { useSelector }                      from 'react-redux'
import { Menu }                             from '@headlessui/react'
import { XMarkIcon, ChevronDownIcon, 
         UserCircleIcon }                   from '@heroicons/react/24/outline'

import MenuList                             from '../menuList/MenuList'
import session                              from '../../utils/session'
import { fetchCurrentTab }                  from "../../utils/fetch-current-tab"
import { SETTING_MENU }                     from '../../utils/constants'


const CommonHeader = (props) => {
    const username          = useSelector((state) => state.login.signupData)
    const name              = useSelector((state) => state.login.loginData)
    const importname        = useSelector((state) => state.collection.collectionData)
    const tabDetails        = useSelector((state) => state.app.tab)
    const userData          = username?.user?.username
    const nameData          = name?.user?.username
    const importnameData    = importname?.[0]?.author?.username
    const [user, setUser]   = useState(userData || nameData || importnameData || "")

    useEffect(() => {
        if(session){
          setUser(session.username)
        }
      }, [session.username])


    const onCloseClick = async () => {
        const tab = tabDetails || await fetchCurrentTab()
        window.chrome.tabs.sendMessage(tab.id, { type: "CT_CLOSE_PANEL" })
    }
    
    return (
        <div className='flex justify-between items-center'>
            <img className='h-[24px]' src="/icons/curateit.svg" alt="curateit.com" />
            <div className='flex justify-end items-center'>
                <span>{user}</span>
                <UserCircleIcon className='h-6 w-6 ml-2 text-[#105FD3] cursor-pointer' />
                <MenuList menus={SETTING_MENU} position="origin-top-left top-0 right-0 mt-8 w-56" indexClass="header-menu">
                    <Menu.Button className="text-white outline-non p-[2px] pt-[5px]">
                        <ChevronDownIcon className="h-4 w-4 text-gray-700" aria-hidden="true" />
                    </Menu.Button>  
                </MenuList>
                <button className="close-btn" onClick={onCloseClick}>
                    <XMarkIcon color="gray" />
                </button>
                {/* {props.showBarIcon && 
                    <button>
                        <Bars3Icon className='h-7 w-7 ml-2 text-gray-700' />
                    </button>
                } */}
            </div>
        </div>
    )
}

export default CommonHeader