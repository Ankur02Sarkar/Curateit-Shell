import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'


const defaultTabs = [
    { name: 'Sign in', href: '#', current: true },
    { name: 'Sign up', href: '#', current: false }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Login = () => {
    const navigate = useNavigate()
    const [tabs, setTabs] = useState(defaultTabs);

    useEffect(() => {
        let session = localStorage.getItem("token");
        if (session === null) {
            navigate('/login');
        } else {
            
        }
    }, [navigate])

    const activateTab = (name) => {
        const newTabs = tabs.map(t => {
            if (t.name === name) {
                return { ...t, current: true }
            } else {
                return { ...t, current: false }
            }
        });

        setTabs(newTabs);
    }


    return (
        <div className="radial-grad w-full h-full py-4 pt-20 bg-slate-50">
            <PublicHeader />
            {/* Tabs */}
            <main className='px-16 mt-[14px]'>
                <div className="border-b border-cyan-100 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-1 justify-around" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <a
                                onClick={() => activateTab(tab.name)}
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                    tab.current
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm w-[48%] text-center'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                {tab.name}
                            </a>
                        ))}
                    </nav>
                </div>
                <h6 className='text-sm text-center text-gray-500'>{tabs.filter(t => t.current === true)[0].name === "Sign in" ? 'or sign in with email' : 'or create your account'}</h6>
                {tabs.filter(t => t.current === true)[0].name === "Sign in" ? <LoginForm /> : <RegisterForm />}
            </main>
        </div>
    )
}

export default Login