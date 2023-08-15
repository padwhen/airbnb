import { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function BookingPage() {
    const {id} = useParams()
    const [booking, setBooking] = useState(null)
    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                response.data.filter(({_id} => _id === id))
            })
        }
    }, [id])
    return (
        <div>
            single booking page for {id}
        </div>
    )
}