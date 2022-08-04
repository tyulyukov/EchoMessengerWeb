export function formatDate(date) {
    const dateTime = new Date(date)

    if (isToday(dateTime))
        return `${convert2digits(dateTime.getHours())}:${convert2digits(dateTime.getMinutes())}`
    else if (isThisYear(dateTime))
        return `${convert2digits(dateTime.getDate())}.${convert2digits(dateTime.getMonth() + 1)}`
    else
        return `${convert2digits(dateTime.getMonth() + 1)}.${dateTime.getFullYear()}`
}

export function convert2digits(number) {
    if (number < 10)
        return `0${number}`

    return number.toString()
}

export function isToday(date) {
    return date.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)
}

export function isThisYear(date) {
    return date.getFullYear() == new Date().getFullYear()
}