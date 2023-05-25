"use client"

import { getMonth } from '../../utils/date';
import { useState, Fragment } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CalendarHeaderProps {
    monthIndex: number,
    setMonthIndex: (month: number) => void
}

function CalendarHeader({monthIndex, setMonthIndex}: CalendarHeaderProps) {
    return (
        <header className="px-4 py-2 flex items-center">
            <h1 className="mr-10 text-xl text-gray-500 font-bold">
                Calendar
            </h1>
            <button onClick={() => setMonthIndex(dayjs().month())} className="border rounded py-2 px-4 mr-5">
                Today
            </button>
            <button onClick={() => setMonthIndex(monthIndex - 1)}><span className="mx-5 text-gray-600"><FaChevronLeft /></span></button>
            <button onClick={() => setMonthIndex(monthIndex + 1)}><span className="mx-5 text-gray-600"><FaChevronRight /></span></button>
            <h2 className="ml-4 text-xl text-gray-600 font-bold">
                {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </h2>
        </header>
    )
}

function Sidebar() {
    return <></>;
}

function Day({day, rowIndex}: {day: Dayjs, rowIndex: number}) {
    function getCurrentDayClass() {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ?
            "bg-blue-600 text-white rounded-full w-7" : "";
    }
    return (
        <div className="border border-gray-200 flex flex-col">
            <header className="flex flex-col items-left">
                {rowIndex === 0 && (<p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>)}
                <p className={`text-sm p-1 my-1 text-left ${getCurrentDayClass()}`}>
                    {day.format('DD')}
                </p>
            </header>
        </div>
    )
}

function Month({monthIndex}: {monthIndex: number}) {
    return (
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
            {
                getMonth(monthIndex).map((row, rowIndex) => 
                    (
                        <Fragment key={rowIndex}> 
                            {
                                row.map((day, colIndex) => {
                                    return <Day day={day} key={colIndex} rowIndex={rowIndex} />
                                })
                            }
                        </Fragment>
                    )
                )
            }
        </div>
    )
}

export default function Calendar() {
    const [monthIndex, setMonthIndex] = useState(dayjs().month());

    return (
        <>
            <div className="h-screen flex flex-col">
                <CalendarHeader monthIndex={monthIndex} setMonthIndex={setMonthIndex}/>
                <div className="flex flex-1">
                    <Sidebar />
                    <Month monthIndex={monthIndex} />
                </div>
            </div>
        </>
    )
}