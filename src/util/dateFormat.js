export function formatDate (date) {
    const dateTime = new Date(date)

    if (isToday(dateTime))
        return dateTime.toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'});
    else if (isThisYear(dateTime))
        return dateTime.toLocaleTimeString([],{day: '2-digit', month:'2-digit'});
    else
        return dateTime.toLocaleTimeString([],{month: '2-digit', year:'numeric'});
}

export function isToday(date) {
    return date.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)
}

export function isThisYear(date) {
    return date.getFullYear() == new Date().getFullYear()
}