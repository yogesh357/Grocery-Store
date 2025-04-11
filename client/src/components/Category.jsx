import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'


function Category() {
    const { navigate } = useAppContext()
    return (
        <div className='mt-10 '>
            <h1 className='text-4xl font-bold mb-4'>Category</h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6   '>
                {categories.map((category, index) => (

                    <div
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`)
                            scrollTo(0, 0)
                        }}
                        key={index}
                        className=" p-4 rounded-lg shadow-md cursor-pointer group py-5 px-3 gap-2 flex flex-col justify-center items-center"
                        style={{ backgroundColor: category.bgColor }}
                    >
                        <img
                            src={category.image}
                            alt={category.text}
                            className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="mt-2">
                            <h3 className="font-semibold">{category.text}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Category
