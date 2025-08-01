import React, { useEffect, useState } from 'react';

import { Link } from 'react-router';
import { useLocation, matchPath } from 'react-router';

import { useSelector } from 'react-redux';

import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsChevronDown } from 'react-icons/bs';

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from '../../data/Navbar-Link';
import { ACCOUNT_TYPE } from '../../utils/constants';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import ProfileDropdown from '../core/Auth/ProfileDropdown';


const Navbar = () => {
    // Fetching slices from Redux store
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSubLinks = async () => {
        try {
            setLoading(true);
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            setSubLinks(result.data.allCategories);
        } catch (error) {
            console.error("unable to fetch Categories list", error); // Changed to console.error for error logging
            setSubLinks([]); // Ensures subLinks is cleared on error
        } finally {
            setLoading(false); // Ensures loading is set to false regardless of success or failure
        }
    };


    useEffect(() => {
        fetchSubLinks();
    }, []);


    // For matching route 
    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    return (
        <div
            className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 
                ${location.pathname !== "/" ? "bg-richblack-800" : ""
                } transition-all duration-200`}
        >
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                {/* Logo */}
                <Link to='/'>
                    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>

                <nav className="hidden md:block">
                    <ul className='flex gap-x-6 text-richblack-25 '>
                        {
                            NavbarLinks.map((link, index) => (
                                <li key={index} >
                                    {
                                        link.title === "Catalog" ? (
                                            <>
                                                <div
                                                    className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                                                        ? "text-yellow-25"
                                                        : "text-richblack-25"
                                                        }`}
                                                >
                                                    <p className="uppercase tracking-wider">{link.title}</p>
                                                    <BsChevronDown />
                                                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                        {/* Use local loading state for this section */}
                                                        {loading || !subLinks ? (
                                                            <p className="text-center">Loading...</p>
                                                        ) : subLinks.length ? (
                                                            <>
                                                                {subLinks
                                                                    ?.filter(
                                                                        (subLink) => subLink?.course?.length > 0
                                                                    )
                                                                    ?.map((subLink, i) => (
                                                                        <Link
                                                                            to={`/catalog/${subLink.name
                                                                                .split(" ")
                                                                                .join("-")
                                                                                .toLowerCase()}`}
                                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                            key={i}
                                                                        >
                                                                            <p className="uppercase tracking-wider">
                                                                                {subLink.name}
                                                                            </p>
                                                                        </Link>
                                                                    ))}
                                                            </>
                                                        ) : (
                                                            <p className="text-center">No Courses Found</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        ) :
                                            (
                                                <Link to={link?.path}>
                                                    <p
                                                        className={`${matchRoute(link?.path)
                                                            ? "text-yellow-25" : "text-richblack-25"
                                                            } uppercase tracking-wider`}
                                                    >
                                                        {link.title}
                                                    </p>
                                                </Link>
                                            )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </nav>

                {/* login / signup /dashboard */}
                <div className="hidden items-center gap-x-4 md:flex">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR &&
                        (
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                                {totalItems > 0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )
                    }

                    {token === null &&
                        (
                            <Link to="/login">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 uppercase cursor-pointer">
                                    Log In
                                </button>
                            </Link>
                        )
                    }

                    {token === null &&
                        (
                            <Link to="/signup">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 uppercase cursor-pointer">
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }

                    {token !== null && <ProfileDropdown />}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
