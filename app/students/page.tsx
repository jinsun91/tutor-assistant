"use client"

import { AiOutlinePlus } from 'react-icons/ai';
import styles from './students.module.css';
import { useState, useEffect, FormEventHandler } from 'react';
import Modal from '../components/Modal';

interface Student {
    id: number,
    name: String,
    subject: String
}

function AddStudent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({name: '', subject: ''});

    const handleSubmitNewStudent: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        console.log(newStudent);
        fetch("http://localhost:3000/api/students", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newStudent)
        });
        setIsModalOpen(false);
    }

    return (
        <>
            <button className="btn btn-outline w-full" onClick={() => setIsModalOpen(true)}>Add New Student <AiOutlinePlus size={20} /></button>
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
                <form onSubmit={handleSubmitNewStudent}>
                    <h3 className="font-bold text-lg">Add New Student</h3>
                    <div className="modal-action flex justify-center">
                        <input
                            onChange={e => setNewStudent({...newStudent, name: e.target.value})} 
                            type="text" 
                            placeholder="Name" 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    <div className="modal-action">
                        <input 
                            onChange={e => setNewStudent({...newStudent, subject: e.target.value})} 
                            type="text" 
                            placeholder="Subject" 
                            className="input input-bordered w-full" />
                    </div>
                    <div className="modal-action">
                        <button type="submit" className="btn">Submit</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function StudentInfo({student} : {student: Student}) {
    if (!student) {
        return (
            <div className={styles.studentInfo}>
            </div>
        )
    }
    return (
        <div className={styles.studentInfo}>
            <p><span className="font-bold">Name: </span>{student.name}</p>
            <p><span className="font-bold">Subject: </span>{student.subject}</p>
        </div>
    )
}

export default function Students() {
    const [index, setIndex] = useState(0);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/students")
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
                <ul className={`menu bg-base-100 ${styles.studentList}`}>
                    { 
                        students.map(({id, name}: Student, i: number) => {
                            return <li key={id} className="w-full" onClick={() => handleClick(i)}><a className={index === i ? "active" : ""}>{name}</a></li>
                        })
                    }
                </ul>
                <AddStudent />
            </div>
            <div className={styles.studentInfoSection}>
                <StudentInfo student={student} />
            </div>
        </div>
    )
}