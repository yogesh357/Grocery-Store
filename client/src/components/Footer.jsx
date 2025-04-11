import React from 'react'
import { footerLinks, assets } from '../assets/assets'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-green-100">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="logo" />
                    <p className="max-w-[410px] mt-6"> We deliver fresh groceries straight to your doorstep—because you deserve quality without compromise. From farm-fresh produce to pantry essentials, every item is carefully selected for freshness and flavor. Shop with us for a hassle-free grocery experience, delivered with care. </p>
                </div>

                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((footerLink, index) => (
                        <div key={index} >
                            <h2 className='font-bold'>{footerLink.title}</h2>
                            <div>
                                {footerLink.links.map((link) => (
                                    // <Link to={link.url}>
                                    //     <h3 className='p-2'>
                                    //         {link.text}
                                    //     </h3>
                                    // </Link>
                                    <li key={link.text} className='list-none'>

                                        <a href={link.url} className='hover:underline transition'>
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </div>
                        </div>

                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © GreenCart All Right Reserved.
            </p>
        </div>
    );
};

export default Footer
