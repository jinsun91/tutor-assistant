"use client"

import { getMonth } from '../../utils/date';
import { useState, Fragment, FormEventHandler, useEffect, ChangeEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './lessons.module.css';
import Modal from '../components/Modal';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { calculateLessonIncome, formatIncome } from '../../utils/formatting';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export type Lesson = {
    id: number,
    student_name: string,
    student_id: number,
    date_time: Dayjs,
    duration_hours: number,
    duration_mins: number,
    income: number,
    completed: number
}

type Student = {
    id: number,
    name: string,
    subject: string,
    lesson_duration_hours: number,
    lesson_duration_mins: number,
    lesson_rate: number
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
    const [studentId, setStudentId] = useState("");
    const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(Date.now()));
    const [durationHours, setDurationHours] = useState(0);
    const [durationMins, setDurationMins] = useState(0);
    const [income, setIncome] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [students, setStudents] = useState<Student[]>([]);
    const [dateTimeError, setDateTimeError] = useState(false);

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
        setStudentId("");
        setDateTime(dayjs(Date.now()));
        setDurationHours(0);
        setDurationMins(0);
        setIncome(0);
        setCompleted(0);
    }

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (dateTimeError) {
            return;
        }

        const lesson = {
            student_id: parseInt(studentId),
            date_time: dateTime?.format("YYYY-MM-DD HH:mm:ss"),
            duration_hours: durationHours,
            duration_mins: durationMins,
            income: income,
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
        if (!newValue?.isValid()) {
            setDateTimeError(true);
        } else if (newValue !== null) {
            setDateTime(newValue);
            setDateTimeError(false);
        }
    }

    function handleStudentChange(e: ChangeEvent<HTMLSelectElement>) {
        setStudentId(e.target.value);
        const selectedStudent = students.find((s: Student) => s.id === parseInt(e.target.value));
        if (selectedStudent !== undefined) {
            setDurationHours(selectedStudent.lesson_duration_hours);
            setDurationMins(selectedStudent.lesson_duration_mins);
            setIncome(calculateLessonIncome(selectedStudent.lesson_rate, selectedStudent.lesson_duration_hours, selectedStudent.lesson_duration_mins));
        }
    }

    return (
        <>
            <button onClick={openModal} className="btn btn-sm btn-outline btn-info">Add New Lesson</button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full px-2">
                    <h3 className="font-bold text-lg mt-1 mb-3">Add New Lesson</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Student</div>
                        <div>
                            <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={handleStudentChange} required>
                                <option value="" disabled>Choose Student</option>
                                {
                                    students.map((student: Student) => {
                                        return <option key={student.id} value={student.id.toString()}>{student.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className={styles.modalLabels}>Date and Time</div>
                        <div>
                            <DateTimePicker className="w-full" value={dateTime} onChange={handleDateTimeChange} />
                        </div>
                        <div className={styles.modalLabels}>Duration</div>
                        <div className="flex items-center">
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationHours) ? durationHours.toString() : durationHours} onChange={e => {setDurationHours(parseInt(e.target.value))}} required/>
                                <span>hrs</span>
                            </label>
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationMins) ? durationMins.toString() : durationMins} onChange={e => {setDurationMins(parseInt(e.target.value))}} required/>
                                <span>mins</span>
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Income</div>
                        <div>
                            <label className="input-group">
                                <span>$</span>
                                <input type="number" className="input input-bordered w-28" value={isNaN(income) ? income.toString() : formatIncome(income)} onChange={e => {setIncome(parseFloat(e.target.value))}} required/>
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
                        <button type="submit" className="btn">Add</button>
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
    const [income, setIncome] = useState(formatIncome(lesson.income));
    const [completed, setCompleted] = useState(lesson.completed);
    const [students, setStudents] = useState([]);
    const [dateTimeError, setDateTimeError] = useState(false);

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
        setIncome(formatIncome(lesson.income));
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

    const handleUpdate: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (dateTimeError) {
            return;
        }

        const updatedLesson = {
            student_id: studentId,
            date_time: dateTime?.format("YYYY-MM-DD HH:mm:ss"),
            duration_hours: durationHours,
            duration_mins: durationMins,
            income: income,
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
        if (!newValue?.isValid()) {
            setDateTimeError(true);
        } else if (newValue !== null) {
            setDateTime(newValue);
            setDateTimeError(false);
        }
    }

    function handleStudentChange(e: ChangeEvent<HTMLSelectElement>) {
        const selectedStudentId = parseInt(e.target.value)
        setStudentId(selectedStudentId);
        const selectedStudent: any = students.find((s: Student) => s.id === selectedStudentId);
        if (selectedStudent !== undefined) {
            setDurationHours(selectedStudent.lesson_duration_hours);
            setDurationMins(selectedStudent.lesson_duration_mins);
            setIncome(calculateLessonIncome(selectedStudent.lesson_rate, selectedStudent.lesson_duration_hours, selectedStudent.lesson_duration_mins));
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
                <form onSubmit={handleUpdate} className="w-full px-2">
                    <h3 className="font-bold text-lg mt-1 mb-3">Lesson Information</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Student</div>
                        <div>
                            <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={handleStudentChange} required>
                                <option value="" disabled>Choose Student</option>
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
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationHours) ? durationHours.toString() : durationHours} onChange={e => {setDurationHours(parseInt(e.target.value))}} required/>
                                <span>hrs</span>
                            </label>
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationMins) ? durationMins.toString() : durationMins} onChange={e => {setDurationMins(parseInt(e.target.value))}} required/>
                                <span>mins</span>
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Income</div>
                        <div>
                            <label className="input-group">
                                <span>$</span>
                                <input type="number" className="input input-bordered w-28" value={isNaN(income) ? income.toString() : formatIncome(income)} onChange={e => {setIncome(parseFloat(e.target.value))}} required/>
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

function Calendar({monthIndex, lessons, getLessons}: CalendarProps) {
    function getCurrentDayClass(day: Dayjs) {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ?
            `${styles.currentDay}` : "";
    }

    function getDayLessons(lessons: Lesson[], day: Dayjs) {
        const dayLessons = lessons.filter(lesson => dayjs(lesson.date_time).format("DD-MM-YY") === day.format("DD-MM-YY"));
        return dayLessons;
    }

    return ( 
        <>
            <div className={styles.dayOfWeekLabelContainer}>
                <p className="text-sm mt-1">SUN</p>
                <p className="text-sm mt-1">MON</p>
                <p className="text-sm mt-1">TUE</p>
                <p className="text-sm mt-1">WED</p>
                <p className="text-sm mt-1">THU</p>
                <p className="text-sm mt-1">FRI</p>
                <p className="text-sm mt-1">SAT</p>
            </div>
            <div className={styles.calendarContainer}>
                {
                    getMonth(monthIndex).map((row, rowIndex) => 
                        (
                            <Fragment key={rowIndex}> 
                                {
                                    row.map((day, colIndex) => {
                                        return (
                                            <div className={`box-border border border-gray-200 flex flex-col ${getCurrentDayClass(day)} align-top`} key={colIndex}>
                                                <div className="text-right">
                                                    {
                                                        day.date() === 1 && <span className="text-sm">{day.format('MMM')}</span>
                                                    }
                                                    <span className={`${styles.date} text-sm inline-block mr-1`}>
                                                        {day.format('D')}
                                                    </span>
                                                </div>
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
        </>
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
                console.log("DATE TIMEEEEE");
                console.log(lesson.date_time);
                return {...lesson, date_time: dayjs.utc(lesson.date_time), completed: lesson.completed ? 1 : 0}
            });
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
                    <Calendar monthIndex={monthIndex} lessons={lessons} getLessons={getLessons} />
                </div>
            </LocalizationProvider>
        </>
    )
}