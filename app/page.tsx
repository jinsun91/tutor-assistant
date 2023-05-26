"use client"

import { useState, useEffect, FormEventHandler } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ImCheckmark, ImCross } from 'react-icons/im';
import styles from './home.module.css'
import { getDayLessons, Lesson } from './lessons/page';
import { BsTrash3Fill } from 'react-icons/bs';
import { HiPencil } from 'react-icons/hi';
import Modal from './components/Modal';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface LessonsTableProps {
  	todayLessons: Lesson[],
	getLessons: () => Promise<void>
}

interface LessonInfoProps {
    lesson: Lesson,
    getLessons: () => Promise<void>
}

type Student = {
    id: number,
    name: string,
    subject: string
}

function EditLesson({getLessons, lesson}: LessonInfoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentId, setStudentId] = useState(lesson.student_id);
    const [dateTime, setDateTime] = useState<Dayjs | null>(lesson.date_time);
    const [duration, setDuration] = useState(lesson.duration);
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
        setDuration(lesson.duration);
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
            duration: duration,
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
            <div className="tooltip" data-tip="Edit Lesson">
				<div className="rounded-full shadow p-2 mr-1.5 cursor-pointer" onClick={openModal}>
					<HiPencil size={20} className="text-blue-500"/>
				</div>
			</div>
            <Modal isModalOpen={isModalOpen}>
                <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-4 top-4" onClick={() => setIsModalOpen(false)}>✕</label>
                <form onSubmit={handleAdd} className="w-full">
                    <h3 className="font-bold text-lg">Edit Lesson</h3>
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
                    <div className="modal-action w-full">
                        <label className="label">
                            <span className="label-text">Completed</span>
                        </label>
                        <select value={completed} onChange={e => {setCompleted(parseInt(e.target.value))}} className="select select-bordered w-full max-w-xs">
                            <option key={0} value={0}>No</option>
                            <option key={1} value={1}>Yes</option>
                        </select>
                    </div>
                    <div className="mt-5">
                        <div className="flex justify-between">
                            <button onClick={handleDelete} className="btn btn-outline btn-error btn-sm">Delete</button>
                            <button type="submit" className="btn btn-outline btn-info btn-sm">Save Changes</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}

function LessonsTable({todayLessons, getLessons}: LessonsTableProps) {

	function handleMarkAsComplete(lesson: Lesson) {
		const updatedLesson = {
			...lesson,
			date_time: lesson.date_time.format("YYYY-MM-DD HH:mm:ss"),
			completed: !lesson.completed
		}	

		fetch(`/api/lessons/${lesson.id}`, {
			method: "PUT",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(updatedLesson),
		}).then(() => {
			getLessons();
		});
	}


	if (todayLessons.length === 0) {
		return (
		<p>No Lessons Today</p>
		)
  	}	
  	return (
		<div className="overflow-x-auto">
			<table className="table table-compact w-full">
				<thead>
				<tr>
					<th>Student</th> 
					<th>Time</th> 
					<th>Duration</th> 
					<th>Completed</th>
					<th>Actions</th>
				</tr>
				</thead> 
				<tbody>
					{
						todayLessons.map((lesson: Lesson, index) => {
							return (
								<tr key={index}>
									<td>{lesson.student_name}</td>
									<td>{lesson.date_time.format("hh:mm A")}</td>
									<td>{lesson.duration}</td>
									<td className={lesson.completed === 0 ? "bg-red-200" : "bg-green-200"}>{lesson.completed === 1 ? "Yes" : "No"}</td>
									<td>
										<div className="flex">
											{
												lesson.completed === 0 && 
												<div className="tooltip" data-tip="Mark as Complete">
													<div className="rounded-full shadow p-2 mr-1.5 cursor-pointer" onClick={() => handleMarkAsComplete(lesson)}>
														<ImCheckmark size={20} className="text-green-500"/>
													</div>
												</div>
											}
											{lesson.completed === 1 &&
											<div className="tooltip" data-tip="Mark as Not Complete"> 
												<div className="rounded-full shadow p-2 mr-1.5 cursor-pointer" onClick={() => handleMarkAsComplete(lesson)}>
													<ImCross size={20} className="text-red-500"/>
												</div>
											</div>
											}
											<EditLesson getLessons={getLessons} lesson={lesson} />
										</div>
									</td>
								</tr>
							)
						})
					}
				</tbody> 
			</table>
		</div>
  	)
}

export default function Home() {
	const [lessons, setLessons] = useState<Lesson[]>([]);

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

	const today = dayjs(Date.now());
	const todayLessons = getDayLessons(lessons, today);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<main className="text-center">
				<h2>{today.format("MMMM DD, YYYY")}</h2>
				<div className="flex w-full">
					<div className={styles.todayLessonsSection}>
						<h2>Today's Lessons</h2>
						<LessonsTable todayLessons={todayLessons} getLessons={getLessons} />
					</div>
					<div className={styles.todayEarningsSection}>
						<h2>Today's Earnings</h2>
						<div className="stats shadow">
							<div className="stat">
								<div className="stat-title">Total Page Views</div>
								<div className="stat-value">89,400</div>
								<div className="stat-desc">21% more than last month</div>
							</div>
						</div>
						<button className="btn btn-success">Add Earnings to Finances</button>
					</div>
				</div>
			</main>
		</LocalizationProvider>
	)
}
