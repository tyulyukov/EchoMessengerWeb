export function formatDate(date) {
    const dateTime = new Date(date)

    if (isToday(date)) {
        return `${convert2digits(dateTime.getHours())}:${convert2digits(dateTime.getMinutes())}`
    }
    else if (isThisYear(date))
        return `${convert2digits(dateTime.getDate())}.${convert2digits(dateTime.getMonth() + 1)}`
    else
        return `${convert2digits(dateTime.getMonth() + 1)}.${dateTime.getFullYear()}`
}

export function formatTime(date) {
    const dateTime = new Date(date)
    return `${convert2digits(dateTime.getHours())}:${convert2digits(dateTime.getMinutes())}`
}

export function convert2digits(number) {
    if (number < 10)
        return `0${number}`

    return number.toString()
}

export function isToday(date) {
    const dateTime = new Date(date)
    return dateTime.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)
}

export function isThisYear(date) {
    const dateTime = new Date(date)
    return dateTime.getFullYear() == new Date().getFullYear()
}

export function isSameDate(date1, date2) {
    const dateTime1 = new Date(date1)
    const dateTime2 = new Date(date2)
    return dateTime1.setHours(0,0,0,0) == dateTime2.setHours(0,0,0,0)
}