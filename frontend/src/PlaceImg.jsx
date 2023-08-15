export default function PlaceImg({place, index=0, className=null}) {
    if (!place.photos?.length) {
        return ''
    }
    if (!className) {
        className = 'object-cover'
    }
    return (
            <img className={className} src={'http://192.168.0.102:4000/uploads/'+place.photos[index]} alt="" />
    )
}