import { useState } from "react";
import axios from "axios";

export default function PhotosUploader({addedPhotos, onChange}) {
    const [photoLink, setPhotoLink] = useState('')
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
            onChange(previous => {
                return [...previous, ...filenames]
            })
        })
    }

    async function addPhotoByLink(event) {
        event.preventDefault();
        const {data: filename} = await axios.post('/upload-by-link', {link: photoLink})
        onChange(previous => {
            return [...previous, filename]
        })
        setPhotoLink('')
    }
    return (
        <>
            <div className="flex gap-2">
                <input type="text" 
                        value={photoLink} 
                        onChange={event => setPhotoLink(event.target.value)} 
                        placeholder={'Add using a link ...jpg'}></input>
                <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
            </div>

            <div className="mt-2 gap-2 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
                {addedPhotos.length > 0 && addedPhotos.map(link => (
                    <div className='h-32 flex' key={link}>
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
        </>
    )
}