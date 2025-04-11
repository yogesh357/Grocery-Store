import React from 'react'
import { assets, features } from '../assets/assets'

function SecondBanner() {
    return (
        <div className='mt-24 relative'>
            <img className='md:block hidden w-full' src={assets.bottom_banner_image} alt="secondBanner" />
            <img className='md:hidden w-full' src={assets.bottom_banner_image_sm} alt="secondBanner" />

            <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
                <div>

                    <h1 className="text-2xl md:text-2xl font-semibold mb-6 text-green-600">Why We Are the Best?</h1>


                    {features.map((feature, index) => (
                        <div className="flex gap-4 mt-2 items-center" key={index}>
                            <img
                                src={feature.icon}
                                alt={feature.title}
                                className="md:w-11 w-9"
                            />
                            <div>
                                <h3 className="font-semibold text-lg md:text-xl">{feature.title}</h3>
                                <p className="md:text-sm text-gray-500/70 text-xs">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SecondBanner
