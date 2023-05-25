"use client"

import { getMonth } from '../../utils/date';
import { useState, Fragment } from 'react';
import dayjs, { Dayjs } from 'dayjs';

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
            <div className="flex flex-col items-left">
                {rowIndex === 0 && (<p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>)}
                <p className={`text-sm p-1 my-1 text-left ${getCurrentDayClass()}`}>
                    {day.format('DD')}
                </p>
            </div>
        </div>
    )
}

function Month({month}: {month: Array<Array<Dayjs>>}) {
    return (
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
            {
                month.map((row, rowIndex) => 
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
    const [currentMonth, setCurrentMonth] = useState(getMonth());

    return (
        <>
            <div className="h-screen flex flex-columns">
                <div className="flex flex-1">
                    <Sidebar />
                    <Month month={currentMonth} />
                </div>
            </div>
        </>
    )
}