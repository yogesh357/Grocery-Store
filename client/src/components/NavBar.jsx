import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';



function NavBar() {
    const [open, setOpen] = useState(false)
    const { axios, user, setUser, getCartCount, setShowUserLogin, navigate, setSearchQuery, searchQuery } = useAppContext()

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
                setUser(null)
                navigate('/')

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate('/products')
        }
    }, [searchQuery])

    return (

        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <div onClick={() => setOpen(false)}>
                <Link to='/'>
                    <img src={assets.logo} alt="logoImage" />
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8 list-none">
                <li > <Link to='/'>Home </Link></li>
                <li > <Link to='/products'>All Products </Link></li>
                <li > <Link to='/contact'>Contact </Link></li>
                {/* {!user &&
                    <div className='px-2.5 py-1 border border-green-800 bg-green-300 text-xl rounded-xl'>
                        <Link to={'/seller'}> <button>Join as seller</button></Link>
                    </div>
                } */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        onChange={((e) => setSearchQuery(e.target.value))}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <SearchIcon />
                </div>

                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <ShoppingCartIcon />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>


                {!user ?
                    (<button
                        onClick={() => {
                            setShowUserLogin(true)
                        }

                        }
                        className="cursor-pointer px-6 py-2 mt-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full text-sm">
                        Login
                    </button>) : (
                        <div className='relative group'>
                            <img className='w-10' src={assets.profile_icon} alt="profile" />
                            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 
                            w-30 rounded-md z-40'>
                                <li onClick={() => navigate('/my-orders')} className='p-1.5 pl-3  hover:bg-gray-200 cursor-pointer'>My Orders</li>
                                <li onClick={logout} className='p-1.5 pl-3 hover:bg-gray-200   cursor-pointer'>Logout</li>
                            </ul>
                        </div>
                    )}
            </div>

            {/* for mobile user  */}
            <div className='flex items-center gap-6 sm:hidden'>
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <ShoppingCartIcon />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" >

                    <img src={assets.menu_icon} alt="menue icon" />
                </button>
            </div>

            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full z-50 bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                    <Link to='/' onClick={() => setOpen(false)}  >  Home</Link>
                    <Link to='/products' onClick={() => setOpen(false)}>   All Products</Link>
                    {user &&
                        <Link to='/my-orders' onClick={() => setOpen(false)}> My Orders</Link>
                    }
                    <Link to='/contact' onClick={() => setOpen(false)}>   Contact</Link >

                    {!user ?
                        (<button
                            onClick={() => {
                                setOpen(false)
                                setShowUserLogin(true)
                            }
                            }

                            className="cursor-pointer px-6 py-2 mt-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full text-sm">
                            Login
                        </button>) : (
                            <button className="cursor-pointer px-6 py-2 mt-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full text-sm"
                                onClick={logout}

                            >
                                Logout
                            </button>

                        )}
                </div>)}

        </nav>
    )
}


export default NavBar
