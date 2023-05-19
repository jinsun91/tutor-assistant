"use client"

import { AiOutlinePlus } from 'react-icons/ai';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import styles from './students.module.css';
import { useState, useEffect, FormEventHandler } from 'react';
import Modal from '../components/Modal';

interface Student {
    id: number,
    name: String,
    subject: String
}

interface StudentProps {
    getStudents: () => void
}

function AddStudent({ getStudents }: StudentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");

    function closeModal() {
        setIsModalOpen(false);
        setName("");
        setSubject("");
    }

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const newStudent = {
            name: name,
            subject: subject
        }

        console.log(newStudent);
        fetch("http://localhost:3000/api/students", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newStudent)
        }).then(() => {
            getStudents();
        });
        closeModal();
    }

    return (
        <>
            <button className="btn btn-outline btn-primary w-full" onClick={() => setIsModalOpen(true)}>Add New Student <AiOutlinePlus size={20} /></button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd}>
                    <h3 className="font-bold text-lg">Add New Student</h3>
                    <div className="modal-action flex justify-center">
                        <input
                            value={name}
                            onChange={e => {setName(e.target.value)}} 
                            type="text" 
                            placeholder="Name" 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    <div className="modal-action">
                        <input
                            value={subject} 
                            onChange={e => {setSubject(e.target.value)}}
                            type="text" 
                            placeholder="Subject" 
                            className="input input-bordered w-full" />
                    </div>
                    <div className="modal-action">
                        <button type="reset" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="btn">Add Student</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function DeleteStudent({student, getStudents} : {student: Student, getStudents: () => void}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleDelete() {
        fetch(`http://localhost:3000/api/students/${student.id}`, {
            method: "DELETE",
        }).then(() => {
            getStudents();
        });
        setIsModalOpen(false);
    }

    return (
        <>
            <button className="btn btn-outline btn-error" onClick={() => setIsModalOpen(true)}>Delete <HiOutlineTrash size={20}/></button>
            <Modal isModalOpen={isModalOpen}>
                <h3 className="font-bold text-lg text-center">Are you sure you want to delete {student.name}?</h3>
                <p>All calendar and finance information relating to {student.name} will also be deleted.</p>
                <div className="flex justify-center">
                    <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="btn ml-2 btn-accent" onClick={() => handleDelete()}>Yes, I'm sure</button>
                </div>
            </Modal>
        </>
    );
}

function EditStudent({student, getStudents} : {student: Student, getStudents: () => void}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState(student.name + "");
    const [subject, setSubject] = useState(student.subject + "");

    const handleEdit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        
        const editStudent = {
            name: name,
            subject: subject
        }
        
        closeModal();

        fetch(`http://localhost:3000/api/students/${student.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(editStudent)
        }).then(() => {
            getStudents();
        });
    }

    function openModal() {
        setIsModalOpen(true);
        setName(student.name + "");
        setSubject(student.subject + "");
    }

    function closeModal() {
        setIsModalOpen(false);
        setName("");
        setSubject("");
    }

    return (
        <>
            <button className="btn btn-outline btn-success mr-2.5" onClick={openModal}>Edit <HiOutlinePencil size={20}/></button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleEdit}>
                    <h3 className="font-bold text-lg">Edit Student</h3>
                    <div className="modal-action flex justify-center">
                        <input
                            value={name}
                            onChange={e => {setName(e.target.value)}} 
                            type="text" 
                            placeholder="Name" 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    <div className="modal-action">
                        <input
                            value={subject} 
                            onChange={e => {setSubject(e.target.value)}}
                            type="text" 
                            placeholder="Subject" 
                            className="input input-bordered w-full" />
                    </div>
                    <div className="modal-action">
                        <button type="reset" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="btn">Save Changes</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

function StudentInfo({student, getStudents} : {student: Student, getStudents: () => void}) {
    if (!student) {
        return (<></>)
    }
    return (
        <>
            <div className={styles.studentInfo}>
                <p><span className="font-bold">Name: </span>{student.name}</p>
                <p><span className="font-bold">Subject: </span>{student.subject}</p>
            </div>
            <div className={styles.studentInfoActions}>
                <EditStudent student={student} getStudents={getStudents} />
                <DeleteStudent student={student} getStudents={getStudents} />
            </div>
        </>
    )
}


export default function Students() {
    const [index, setIndex] = useState(-1);
    const [students, setStudents] = useState([]);

    async function getStudents() {
        fetch("http://localhost:3000/api/students")
        .then(response => response.json())
        .then(data => setStudents(data))
    }

    useEffect(() => {
        getStudents();
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
                <AddStudent getStudents={getStudents} />
            </div>
            <div className={styles.studentInfoSection}>
                <div className={styles.studentInfoContainer}>
                    <StudentInfo student={student} getStudents={getStudents} />
                </div>
            </div>
        </div>
    )
}