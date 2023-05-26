"use client"

import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';

type Lesson = {
  id: number,
  student_name: string,
  student_id: number,
  date_time: Dayjs,
  duration: number
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

  function getDayLessons(day: Dayjs) {
    const dayLessons = lessons.filter(lesson => dayjs(lesson.date_time).format("DD-MM-YY") === day.format("DD-MM-YY"));
    return dayLessons;
  }

  const today = dayjs(Date.now());
  const todayLessons = getDayLessons(today);

  return (
    <main className="text-center">
      <h1>Welcome to Tutor Assistant</h1>
      <h2>Here are your lessons for today: {today.format("MMMM DD, YYYY")}</h2>
      <div className="stats shadow">
        <ul className="menu p-4 w-80 bg-base-100 text-base-content flex justify-between">
          { 
            todayLessons.length > 0 ?
            getDayLessons(dayjs(Date.now())).map(lesson => {
              return <li><a><b>{lesson.student_name}</b> - {lesson.date_time.format("hh:mm A")}</a></li>
            }) : <p>No Lessons Today</p>
          }
        </ul>
      </div>
    </main>
  )
}
