"use client"

import { AiOutlinePlus } from 'react-icons/ai';
import styles from './students.module.css';
import { useState, useEffect } from 'react';

interface Student {
    id: number,
    student_name: String,
    subject: String
}

function StudentInfo({student} : {student : Student}) {
    if (!student) {
        return (
            <div className={styles.studentInfo}>
            </div>
        )
    }
    return (
        <div className={styles.studentInfo}>
            <p><span className={styles.fieldName}>Name: </span>{student.student_name}</p>
            <p><span className={styles.fieldName}>Subject: </span>{student.subject}</p>
        </div>
    )
}

export default function Students() {
    const [index, setIndex] = useState(0);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/students')
        .then(response => response.json())
        .then(data => setStudents(data)
    );
    }, []);

    console.log(students);

    function handleClick(index: number) {
        setIndex(index);
    }

    let student: Student = students[index];

    return (
        <div className={styles.container}>
            <div className={`${styles.studentListSection}`}>
                <ul className={"menu bg-base-100 " + `${styles.studentList}`}>
                    { 
                        students.map(({id, student_name}: Student, i: number) => {
                            return <li key={id} className="w-full" onClick={() => handleClick(i)}><a className={index === i ? "active" : ""}>{student_name}</a></li>
                        })
                    }
                </ul>
                <button className="btn btn-outline w-full">Add New Student <AiOutlinePlus size={20} /></button>
            </div>
            <div className={styles.studentInfoSection}>
                <StudentInfo student={student} />
            </div>
        </div>
    )
}