import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import { RingLoader } from 'react-spinners'

import Sidebar from '../components/core/dashboard/Sidebar'


const DashBoard = () => {


    const { loading: authLoading } = useSelector((state) => state.auth)
    const { loading: profileLoading } = useSelector((state) => state.profile)


    if (profileLoading || authLoading) {
        return (
            // <div>
            //     loading...
            // </div>
            <RingLoader
                color="#6E5503"
                size={200}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        )
    }

    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar />
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default DashBoard