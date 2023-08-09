import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"

export default function PlacePage() {
    const {id} = useParams()
    const [place, setPlace] = useState(null)
    const [showAllPhotos, setShowAllPhotos] = useState(false)
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data)
        })
    }, [id])
    if (!place) return null;
    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-black text-white min-h-screen">
                <div className=" bg-black p-8 grid gap-4">
                    <div>
                        <h2 className="text-3xl">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        Close photos
                        </button>
                    </div>
                {place?.photos?.length > 0 && place.photos.map(photo => (
                    <div className="w-300 h-300">
                        <img className="w-full h-full object-contain" src={"http://192.168.0.102:4000/uploads/"+photo} alt="" />
                    </div>
                ))}
                </div>
                </div>
        )
    }
    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
            <h1 className="text-3xl">{place.title}</h1>
            <a className=" my-2 block font-semibold underline" target="_blank" href={'https://maps.google.com/?q='+place.address}>{place.address}</a>
        <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr]">
                <div>
                    {place.photos?.[0] && (
                    <div>
                    <img className="aspect-square object-cover" src={`http://192.168.0.102:4000/uploads/${place.photos[0]}`} alt="" />
                    </div>
                    )}
                </div>
                <div className="grid">
                    {place.photos?.[1] && (
                    <img className="aspect-square object-cover" src={`http://192.168.0.102:4000/uploads/${place.photos[1]}`} alt="" />
                    )}
                    <div className="overflow-hidden">
                    {place.photos?.[2] && (
                    <img className="aspect-square relative top-2 object-cover" src={`http://192.168.0.102:4000/uploads/${place.photos[2]}`} alt="" />
                    )}
                    </div>
                </div>
                <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                    </svg>
                    show all photos
                </button>
            </div>
        </div>
        </div>
    )
}