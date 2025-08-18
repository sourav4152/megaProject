import React, { useEffect } from 'react'

function Error() {

    useEffect( ()=>{
            document.title="Page-Not-Found"
        },[])
    return (
        <div className="flex flex-1 justify-center items-center text-white text-3xl">
            Error 404 - Page Not Found
        </div>
    );
}

export default Error;