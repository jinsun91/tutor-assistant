"use client"

import { useState, useEffect, FormEventHandler } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ImCheckmark, ImCross } from 'react-icons/im';
import styles from './home.module.css'
import { getDayLessons, Lesson } from './lessons/page';
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
				</tr>
				</thead> 
				<tbody>
					{
						todayLessons.map((lesson: Lesson, index) => {
							return (
								<tr key={index}>
									<td>{lesson.student_name}</td>
									<td>{lesson.date_time.format("hh:mm A")}</td>
									<td>{lesson.duration_hours} {lesson.duration_hours === 1 ? "hr" : "hrs"} {lesson.duration_mins} mins</td>
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
