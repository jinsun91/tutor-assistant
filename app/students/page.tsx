"use client"

import { AiOutlinePlus } from 'react-icons/ai';
import styles from './students.module.css';

interface Student {
    id: number,
    student_name: String,
    subject: String
}

export async function getStudents() {
    const res = await fetch('http://localhost:3000/api/students');
    return res.json();
}

function StudentInfo() {
    return (
        <div className={styles.studentInfo}>

        </div>
    )
}

export default async function Students() {
    const students = await getStudents();
    console.log(students);
    
    return (
        <div className={styles.container}>
            <div className={`${styles.studentListSection}`}>
                <ul className={"menu bg-base-100 " + `${styles.studentList}`}>
                    { 
                        students.map(({id, student_name, subject}: Student) => {
                            return <li key={id} className="w-full"><a>{student_name}</a></li>
                        })
                    }
                </ul>
                <button className="btn btn-outline w-full">Add New Student <AiOutlinePlus size={20} /></button>
            </div>
            <div className={styles.studentInfoSection}>
                <StudentInfo />
            </div>
        </div>
    )
}