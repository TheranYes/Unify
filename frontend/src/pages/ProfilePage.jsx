import { useState, useEffect } from "react";
export default function ProfilePage() {
    const SERVER_URL = "http://google.com";
    async function getProfile() {
        const body = await fetch(`${SERVER_URL}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!body.ok) {
            return null;
        }

        const data = await body.json();
        return { username: data.username, img: data.img, tag: data.tag };
    }

    const [username, setUsername] = useState("me");
    const [img, setImg] = useState("https://i.scdn.co/image/ab67757000003b820495182f3d86e0becf9da666");
    const [tag, setTag] = useState("jk");
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        getProfile().then(profile => {
            setUsername(profile.username);
            console.log(profile);
            setImg(profile.img);
            setTag(profile.tag);
        });
    }, []);

    return <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-cream via-gray-100 to-cream dark:from-charcoal dark:via-gray-800 dark:to-charcoal">
         <div className="relative w-5/6 lg:w-1/2 h-5/6 rounded-lg p-8 bg-white-80 dark:bg-gray-700 backdrop-blur-sm shadow-xl z-20">
            <div className="w-full h-4/5 flex flex-col items-center justify-around">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {username ? `${username}'s Profile` : "Loading..."}
                </h1>
                {img ? <img src={img} alt="Profile" className="w-48 h-48 rounded-full" /> : null}
                
                <div>
                <label htmlFor="tag" className="text-lg font-bold text-gray-900 dark:text-white mr-5">Instagram</label>
                <input type="text" id="tag" value={tag} onChange={(e) => {
                    setIsEditing(true);
                    setTag(e.target.value);
                }} className="text-bold rounded-sm bg-gray-400 p-2 border-b-4 border-orange-700 outline-2 focus:outline-cyan-400" />
                </div>
                { isEditing ? <button
                    className="absolute right-5 bottom-5 w-fit bg-orange-700 text-white p-3 rounded-full 
                    hover:bg-orange-600/90 transition-all duration-200
                    text-md font-semibold shadow-lg transform hover:scale-[1.02] space-x-2">
                        <span>Save Profile</span>
            </button> : null}
            </div>
         </div>
    </div> 
}