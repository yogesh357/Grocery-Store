import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        console.log("sending the backend reequest for sub");


        setLoading(true);
        try {

            const { data } = await axios.post('/api/subscriber/subscribe', { email });
            if (data.success) {
                toast.success(data.message);
                setEmail('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Failed to subscribe. Please try again.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-30 pb-14">
            <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
            <p className="md:text-lg text-gray-500/70 pb-8">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>
            <form onSubmit={handleSubmit} className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
                    type="email"
                    placeholder="Enter your email id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="md:px-12 px-8 h-full text-white bg-green-700 hover:bg-green-800 transition-all cursor-pointer rounded-md rounded-l-none disabled:bg-green-500"
                >
                    {loading ? "Subscribing..." : "Subscribe"}
                </button>
            </form>
        </div>
    )
}

export default NewsLetter
