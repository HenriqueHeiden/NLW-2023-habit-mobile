import dayjs from 'dayjs'

export function generateDatesFromYearBeginning(){
    const firstDayOfTheYarn = dayjs().startOf('year')
    const today= new Date()
    
    const dates = []
    let compareDate = firstDayOfTheYarn

    while(compareDate.isBefore(today)){
        dates.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }

    return dates

}