"use client"

import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import styles from './students.module.css';
import { useState, useEffect, FormEventHandler } from 'react';
import Modal from '../components/Modal';
import { formatDateTime } from '../../utils/formatting';

type Student = {
    id: number,
    name: string,
    subject: string,
    lesson_duration_hours: number,
    lesson_duration_mins: number,
    lesson_rate: number
}

interface ModifyStudentProps {
    getStudents: () => Promise<void>,
    student: Student
}

interface AddStudentProps {
    getStudents: () => Promise<void>
}

function AddStudent({ getStudents }: AddStudentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [durationHours, setDurationHours] = useState(0);
    const [durationMins, setDurationMins] = useState(0);
    const [rate, setRate] = useState(0);

    function openModal() {
        setIsModalOpen(true);
        setName("");
        setSubject("");
        setDurationHours(0);
        setDurationMins(0);
        setRate(0);
    }

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const newStudent = {
            name: name,
            subject: subject,
            lesson_duration_hours: durationHours,
            lesson_duration_mins: durationMins,
            lesson_rate: rate
        }

        console.log(newStudent);
        fetch("/api/students", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newStudent)
        }).then(() => {
            getStudents();
        });
        setIsModalOpen(false);
    }

    return (
        <>
            <button className="btn btn-outline btn-info w-full" onClick={openModal}>Add New Student</button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full px-2">
                    <h3 className="font-bold text-lg mt-1 mb-3">Add New Student</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Name</div>
                        <div>
                            <input value={name} onChange={e => {setName(e.target.value)}}  type="text" className="input input-bordered w-full" required />
                        </div>
                        <div className={styles.modalLabels}>Subject</div>
                        <div>
                            <input value={subject} onChange={e => {setSubject(e.target.value)}} type="text" className="input input-bordered w-full" required />
                        </div>
                        <div className={styles.modalLabels}>Lesson Duration</div>
                        <div className="flex items-center">
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationHours) ? durationHours.toString() : durationHours} onChange={e => {setDurationHours(parseInt(e.target.value))}} required />
                                <span>hrs</span>
                            </label>
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationMins) ? durationMins.toString() : durationMins} onChange={e => {setDurationMins(parseInt(e.target.value))}} required />
                                <span>mins</span>
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Lesson Rate</div>
                        <div>
                            <label className="input-group">
                                <span>$</span>
                                <input type="number" className="input input-bordered w-24" value={isNaN(rate) ? rate.toString() : rate} onChange={e => {setRate(parseInt(e.target.value))}} required />
                                <span>per hour</span>
                            </label>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn">Add</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function DeleteStudent({getStudents, student}: ModifyStudentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleDelete() {
        fetch(`/api/students/${student.id}`, {
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

function EditStudent({getStudents, student}: ModifyStudentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState(student.name);
    const [subject, setSubject] = useState(student.subject);
    const [durationHours, setDurationHours] = useState(student.lesson_duration_hours);
    const [durationMins, setDurationMins] = useState(student.lesson_duration_mins);
    const [rate, setRate] = useState(student.lesson_rate);

    const handleEdit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        
        const editStudent = {
            name: name,
            subject: subject,
            lesson_duration_hours: durationHours,
            lesson_duration_mins: durationMins,
            lesson_rate: rate
        }

        fetch(`/api/students/${student.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(editStudent)
        }).then(() => {
            getStudents();
        });

        setIsModalOpen(false);
    }

    function openModal() {
        setIsModalOpen(true);
        setName(student.name);
        setSubject(student.subject);
        setDurationHours(student.lesson_duration_hours);
        setDurationMins(student.lesson_duration_mins);
        setRate(student.lesson_rate);
    }

    return (
        <>
            <button className="btn btn-outline btn-primary mr-2.5" onClick={openModal}>Edit <HiOutlinePencil size={20}/></button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleEdit}>
                <h3 className="font-bold text-lg mt-1 mb-3">Edit Student</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Name</div>
                        <div>
                            <input value={name} onChange={e => {setName(e.target.value)}}  type="text" className="input input-bordered w-full" required />
                        </div>
                        <div className={styles.modalLabels}>Subject</div>
                        <div>
                            <input value={subject} onChange={e => {setSubject(e.target.value)}} type="text" className="input input-bordered w-full" required />
                        </div>
                        <div className={styles.modalLabels}>Lesson Duration</div>
                        <div className="flex items-center">
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationHours) ? durationHours.toString() : durationHours} onChange={e => {setDurationHours(parseInt(e.target.value))}} required />
                                <span>hrs</span>
                            </label>
                            <label className="input-group">
                                <input type="number" className="input input-bordered w-20" value={isNaN(durationMins) ? durationMins.toString() : durationMins} onChange={e => {setDurationMins(parseInt(e.target.value))}} required />
                                <span>mins</span>
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Lesson Rate</div>
                        <div>
                            <label className="input-group">
                                <span>$</span>
                                <input type="number" className="input input-bordered w-24" value={isNaN(rate) ? rate.toString() : rate} onChange={e => {setRate(parseInt(e.target.value))}} required />
                                <span>per hour</span>
                            </label>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-success">Save Changes</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

function StudentInfo({getStudents, student}: ModifyStudentProps) {
    if (!student) {
        return (<></>)
    }
    return (
        <>
            <div className={styles.studentInfo}>
                <p><span className="font-bold">Name: </span>{student.name}</p>
                <p><span className="font-bold">Subject: </span>{student.subject}</p>
                <p><span className="font-bold">Lesson Duration: </span>{formatDateTime(student.lesson_duration_hours, student.lesson_duration_mins)}</p>
                <p><span className="font-bold">Lesson Rate: </span>${student.lesson_rate} per hour</p>
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
        fetch("/api/students")
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
            <div className={styles.studentListSection}>
                <ul className={styles.studentList}>
                    { 
                        students.map(({id, name}: Student, i: number) => {
                            return <li key={id} className={`w-full ${index === i ? styles.selectedStudent : styles.studentListItem}`} onClick={() => handleClick(i)}>{name}</li>
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