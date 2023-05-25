"use client"

import { getMonth } from '../../utils/date';
import { useState, Fragment, FormEventHandler, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './calendar.module.css';
import Modal from '../components/Modal';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

type Lesson = {
    id: number,
    student_name: string,
    student_id: number,
    date_time: Dayjs,
    duration: number
}

type Student = {
    id: number,
    name: string,
    subject: string
}

interface CalendarProps {
    monthIndex: number,
    lessons: Lesson[],
}

interface AddLessonProps {
    getLessons: () => Promise<void>
}

function AddLesson({getLessons}: AddLessonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentId, setStudentId] = useState(-1);
    const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(Date.now()));
    const [duration, setDuration] = useState(0);
    const [students, setStudents] = useState([]);

    async function getStudents() {
        fetch("/api/students")
        .then(response => response.json())
        .then(data => setStudents(data))
    }

    useEffect(() => {
        getStudents();
    }, []);

    function openModal() {
        setIsModalOpen(true);
        setStudentId(-1);
        setDateTime(dayjs(Date.now()));
        setDuration(0);
    }

    console.log(dateTime);

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        console.log("DATE TIME IS: ");
        console.log(dateTime);

        const lesson = {
            student_id: studentId,
            date_time: dateTime?.format("YYYY-MM-DD HH:mm:ss"),
            duration: duration
        }
        
        console.log(lesson);
        fetch("/api/lessons", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(lesson)
        }).then(() => {
            getLessons();
        });
        setIsModalOpen(false);
    }

    function handleDateTimeChange(newValue: Dayjs | null) {
        if (newValue !== null) {
            setDateTime(newValue);
        }
    }

    return (
        <>
            <button onClick={openModal} className="btn">Add Lesson</button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full">
                    <h3 className="font-bold text-lg">Add Lesson</h3>
                    <div className="modal-action w-full">
                        <label className="label">
                            <span className="label-text">Student</span>
                        </label>
                        <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={e => {setStudentId(parseInt(e.target.value))}}>
                            <option value={-1} disabled>Choose Student</option>
                            {
                                students.map((student: Student) => {
                                    return <option key={student.id} value={student.id}>{student.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="modal-action w-full">
                        <label className="label">
                            <span className="label-text">Date and Time</span>
                        </label>
                        <DateTimePicker className="w-full" value={dateTime} onChange={handleDateTimeChange}/>
                    </div>
                    <div className="modal-action w-full">
                        <label className="label">
                            <span className="label-text">Lesson Duration</span>
                        </label>
                        <input type="number" value={duration} placeholder="Enter Amount" onChange={e => {setDuration(parseInt(e.target.value))}} className="input input-md input-bordered w-full max-w-xs" />
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn">Add</button>
                    </div>
                </form>
            </Modal>
        </>
    )
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

function Calendar({monthIndex, lessons}: CalendarProps) {
    function getCurrentDayClass(day: Dayjs) {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ?
            "bg-blue-600 text-white rounded-full w-7" : "";
    }

    function getDayLessons(day: Dayjs) {
        const dayLessons = lessons.filter(lesson => dayjs(lesson.date_time).format("DD-MM-YY") === day.format("DD-MM-YY"));
        return dayLessons;
    }

    return (
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
            {
                getMonth(monthIndex).map((row, rowIndex) => 
                    (
                        <Fragment key={rowIndex}> 
                            {
                                row.map((day, colIndex) => {
                                    return (
                                        <div className="border border-gray-200 flex flex-col" key={colIndex}>
                                            <header className="flex flex-col items-left">
                                                {rowIndex === 0 && (<p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>)}
                                                <p className={`text-sm p-1 my-1 text-left ${getCurrentDayClass(day)}`}>
                                                    {day.format('DD')}
                                                </p>
                                            </header>
                                            <div>
                                                { getDayLessons(day).map(lesson => {
                                                    return <div>{lesson.student_name}</div>
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Fragment>
                    )
                )
            }
        </div>
    )
}

export default function Lessons() {
    const [monthIndex, setMonthIndex] = useState(dayjs().month());
    const [lessons, setLessons] = useState([]);

    async function getLessons() {
        fetch("/api/lessons")
        .then(response => response.json())
        .then(data => {
            const formattedData = data.map((lesson: Lesson) => {
                return {...lesson, date_time: dayjs(lesson.date_time)}
            });
            console.log("HERO");
            console.log(formattedData);
            setLessons(formattedData);
        });
    }

    useEffect(() => {
        getLessons();
    }, []);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className={styles.calendar}>
                    <header className={styles.calendarHeaderContainer}>
                        <div className={styles.calendarActions}>
                            <button onClick={() => setMonthIndex(dayjs().month())} className="border rounded py-2 px-4 mr-5">
                                Today
                            </button>
                            <button onClick={() => setMonthIndex(monthIndex - 1)}><span className="mx-5 text-gray-600"><FaChevronLeft /></span></button>
                            <button onClick={() => setMonthIndex(monthIndex + 1)}><span className="mx-5 text-gray-600"><FaChevronRight /></span></button>
                            <h2 className="ml-4 text-xl text-gray-600 font-bold">
                                {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
                            </h2>
                        </div>
                        <div>
                            <AddLesson getLessons={getLessons}/>
                        </div>
                    </header>
                    <Calendar monthIndex={monthIndex} lessons={lessons} />
                </div>
            </LocalizationProvider>
        </>
    )
}