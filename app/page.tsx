"use client"

import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ImCheckmark, ImCross } from 'react-icons/im';
import styles from './home.module.css'
import { getDayLessons } from './lessons/page';
import { BsTrash3Fill } from 'react-icons/bs';
import { HiPencil } from 'react-icons/hi';

type Lesson = {
	id: number,
	student_name: string,
	student_id: number,
	date_time: Dayjs,
	duration: number
}

interface LessonsTableProps {
  	todayLessons: Lesson[]
}

function LessonsTable({todayLessons}: LessonsTableProps) {
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
					<th>Actions</th>
				</tr>
				</thead> 
				<tbody>
					{
						todayLessons.map((lesson: Lesson, index) => {
							return (
								<tr className="bg-red-200" key={index}>
									<td>{lesson.student_name}</td>
									<td>{lesson.date_time.format("hh:mm A")}</td>
									<td>{lesson.duration}</td>
									<td>
										<div className="flex">
											<div className="rounded-full shadow p-2 mr-1.5">
												<ImCheckmark size={20} className="text-green-500"/>
											</div>
											{/* <div className="rounded-full shadow p-2 mr-1.5">
												<ImCross size={20} className="text-red-500"/>
											</div> */}
											<div className="rounded-full shadow p-2 mr-1.5">
												<HiPencil size={20} className="text-blue-500"/>
											</div>
											<div className="rounded-full shadow p-2 mr-1.5">
												<BsTrash3Fill size={20} className="text-gray-500"/>
											</div>
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
		<main className="text-center">
			<h2>{today.format("MMMM DD, YYYY")}</h2>
			<div className="flex w-full">
				<div className={styles.todayLessonsSection}>
					<h2>Today's Lessons</h2>
					<div className={`shadow ${styles.todayLessonContainer}`}>
						<LessonsTable todayLessons={todayLessons} />
					</div>
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
	)
}
