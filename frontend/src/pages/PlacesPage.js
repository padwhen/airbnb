import { useState } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import Perks from "../Perks"
import axios from "axios"
export default function PlacesPage() {
    const {action} = useParams()
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [photoLink, setPhotoLink] = useState('')
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description) {
        return (
            <>
            {inputHeader(header)}
            {inputDescription(description)}
            </>
        )
    }

    async function uploadPhoto(event) {
        const files = event.target.files
        const data = new FormData(); 
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i])
        }
        await axios.post('/uploads', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response;
            setAddedPhotos(previous => {
                return [...previous, ...filenames]
            })
        })
    }

    async function addPhotoByLink(event) {
        event.preventDefault();
        const {data: filename} = await axios.post('/upload-by-link', {link: photoLink})
        setAddedPhotos(previous => {
            return [...previous, filename]
        })
        setPhotoLink('')
    }

    return (
        <div>
        {action !== 'new' && (
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add new place
                </Link>
                </div>
        )}
        {action === 'new' && (
            <div>
                <form>
                    {preInput('Title','title for your place, should be short and catchy as in advertisement')}
                    <input type="text" value={title} onChange={event => setTitle(event.target.value)} placeholder="Title, for example: My lovely apartment" /> 
                    
                    {preInput('Address','address for your place')}
                    <input type="text" value={address} onChange={event => setAddress(event.target.value)} placeholder="Address" /> 
                    
                    {preInput('Photos','the more the better!')}
                    <div className="flex gap-2">
                        <input type="text" 
                        value={photoLink} 
                        onChange={event => setPhotoLink(event.target.value)} 
                        placeholder={'Add using a link ...jpg'}></input>
                        <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                    </div>
                    <div className="mt-2 gap-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
                        {addedPhotos.length > 0 && addedPhotos.map(link => (
                            <div className='h-32 flex'>
                                <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/'+link} alt="" />
                            </div>
                        ))}
                        <label className="h-32 cursor-pointer flex items-center justify-center gap-1 border p-2 text-gray-600 text-2xl bg-transparent rounded-2xl p-4">
                            <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            Upload
                        </label>
                    </div>

                    {preInput('Description','description of the place')}
                    <textarea value={description} onChange={event => setDescription(event.target.value)} />

                    {preInput('Perks','select all the perks')}
                    <Perks selected={perks} onChange={setPerks} />

                    {preInput('Extra info','house rules, etc')}
                    <textarea value={extraInfo} onChange={event => setExtraInfo(event.target.value)} />

                    {preInput('Check in & Check out times','remember to have some time window for cleaning the room between guests')}
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <h3 className="mt-2 -mb-1">Check-in time</h3>
                            <input type="text" value={checkIn} 
                            onChange={event => setCheckIn(event.target.value)} placeholder="11" />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Check-out time</h3>
                            <input type="text" value={checkOut} 
                            onChange={event => setCheckOut(event.target.value)} placeholder="14" />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Max number of guests</h3>
                            <input type="number" placeholder="8" value={maxGuests} 
                            onChange={event => setMaxGuests(event.target.value)} />
                        </div>
                    </div>
                        <button className="primary my-4">Save</button>
                </form>
            </div>
        )}
        </div>
    )
}