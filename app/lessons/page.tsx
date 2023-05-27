"use client"

import { getMonth } from '../../utils/date';
import { useState, Fragment, FormEventHandler, useEffect, ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './lessons.module.css';
import Modal from '../components/Modal';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export type Lesson = {
    id: number,
    student_name: string,
    student_id: number,
    date_time: Dayjs,
    duration_hours: number,
    duration_mins: number,
    completed: number
}

type Student = {
    id: number,
    name: string,
    subject: string
}

interface CalendarProps {
    monthIndex: number,
    lessons: Lesson[],
    getLessons: () => Promise<void>
}

interface AddLessonProps {
    getLessons: () => Promise<void>
}

interface LessonInfoProps {
    lesson: Lesson,
    getLessons: () => Promise<void>
}

function AddLesson({getLessons}: AddLessonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentId, setStudentId] = useState(-1);
    const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(Date.now()));
    const [durationHours, setDurationHours] = useState(0);
    const [durationMins, setDurationMins] = useState(0);
    const [completed, setCompleted] = useState(0);
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
        setDurationHours(0);
        setDurationMins(0);
        setCompleted(0);
    }

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const lesson = {
            student_id: studentId,
            date_time: dateTime?.format("YYYY-MM-DD HH:mm:ss"),
            duration_hours: durationHours,
            duration_mins: durationMins,
            completed: completed
        }
        
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
            <button onClick={openModal} className="btn btn-success">Add New Lesson</button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full px-2">
                    <h3 className="font-bold text-lg mt-1 mb-3">Add New Lesson</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Student</div>
                        <div>
                            <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={e => {setStudentId(parseInt(e.target.value))}}>
                                <option value={-1} disabled>Choose Student</option>
                                {
                                    students.map((student: Student) => {
                                        return <option key={student.id} value={student.id}>{student.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className={styles.modalLabels}>Date and Time</div>
                        <div>
                            <DateTimePicker className="w-full" value={dateTime} onChange={handleDateTimeChange}/>
                        </div>
                        <div className={styles.modalLabels}>Duration</div>
                        <div className="flex items-center">
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={durationHours} onChange={e => {setDurationHours(parseInt(e.target.value))}}/>
                                <span>hrs</span>
                            </label>
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={durationMins} onChange={e => {setDurationMins(parseInt(e.target.value))}}/>
                                <span>mins</span>
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Completed</div>
                        <div>
                            <select value={completed} onChange={e => {setCompleted(parseInt(e.target.value))}} className="select select-bordered w-full max-w-xs">
                                <option key={0} value={0}>No</option>
                                <option key={1} value={1}>Yes</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

function LessonInfo({getLessons, lesson}: LessonInfoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentId, setStudentId] = useState(lesson.student_id);
    const [dateTime, setDateTime] = useState<Dayjs | null>(lesson.date_time);
    const [durationHours, setDurationHours] = useState(lesson.duration_hours);
    const [durationMins, setDurationMins] = useState(lesson.duration_mins);
    const [completed, setCompleted] = useState(lesson.completed);
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
        setStudentId(lesson.student_id);
        setDateTime(lesson.date_time);
        setDurationHours(lesson.duration_hours);
        setDurationMins(lesson.duration_mins);
        setCompleted(lesson.completed);
    }

    function handleDelete() {
        fetch(`/api/lessons/${lesson.id}`, {
            method: "DELETE",
        }).then(() => {
            getLessons();
        });
        setIsModalOpen(false);
    }

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const updatedLesson = {
            student_id: studentId,
            date_time: dateTime?.format("YYYY-MM-DD HH:mm:ss"),
            duration_hours: durationHours,
            duration_mins: durationMins,
            completed: completed
        }
        
        fetch(`/api/lessons/${lesson.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedLesson)
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
            <div className={`${styles.lessonInfoContainer} ${lesson.completed === 0 ? "bg-red-200" : "bg-green-200"}`} onClick={openModal}>
                <p className={styles.lessonInfo}><b>{lesson.student_name}</b></p>
                <p className={styles.lessonInfo}>{lesson.date_time.format("hh:mm a")}</p>
            </div>
            <Modal isModalOpen={isModalOpen}>
                <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-4 top-4" onClick={() => setIsModalOpen(false)}>✕</label>
                <form onSubmit={handleAdd} className="w-full px-2">
                    <h3 className="font-bold text-lg mt-1 mb-3">Lesson Information</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Student</div>
                        <div>
                            <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={e => {setStudentId(parseInt(e.target.value))}}>
                                <option value={-1} disabled>Choose Student</option>
                                {
                                    students.map((student: Student) => {
                                        return <option key={student.id} value={student.id}>{student.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className={styles.modalLabels}>Date and Time</div>
                        <div>
                            <DateTimePicker className="w-full" value={dateTime} onChange={handleDateTimeChange}/>
                        </div>
                        <div className={styles.modalLabels}>Duration</div>
                        <div className="flex items-center">
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={durationHours} onChange={e => {setDurationHours(parseInt(e.target.value))}}/>
                                <span>hrs</span>
                            </label>
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={durationMins} onChange={e => {setDurationMins(parseInt(e.target.value))}}/>
                                <span>mins</span>
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Completed</div>
                        <div>
                            <select value={completed} onChange={e => {setCompleted(parseInt(e.target.value))}} className="select select-bordered w-full max-w-xs">
                                <option key={0} value={0}>No</option>
                                <option key={1} value={1}>Yes</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="flex justify-between">
                            <button onClick={handleDelete} className="btn btn-error btn-sm">Delete</button>
                            <button type="submit" className="btn btn-info btn-sm">Save Changes</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export function getDayLessons(lessons: Lesson[], day: Dayjs) {
    const dayLessons = lessons.filter(lesson => dayjs(lesson.date_time).format("DD-MM-YY") === day.format("DD-MM-YY"));
    return dayLessons;
}

function Calendar({monthIndex, lessons, getLessons}: CalendarProps) {
    function getCurrentDayClass(day: Dayjs) {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ?
            "bg-blue-600 text-white rounded-full w-7" : "";
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
                                                { getDayLessons(lessons, day).map(lesson => {
                                                    return <LessonInfo getLessons={getLessons} lesson={lesson} key={lesson.id}/>
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
                    <Calendar monthIndex={monthIndex} lessons={lessons} getLessons={getLessons} />
                </div>
            </LocalizationProvider>
        </>
    )
}