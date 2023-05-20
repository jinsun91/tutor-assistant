"use client"

import styles from './finances.module.css';
import Modal from '../components/Modal';
import { useState, useEffect, FormEventHandler } from 'react';

type Student = {
    id: number,
    name: string,
    subject: string
}

type IncomeEntry = {
    id: number,
    date: string,
    name: string,
    amount: number,
    received: number
}

interface AddIncomeProps {
    getFinances: () => Promise<void>
}

function AddIncome({ getFinances }: AddIncomeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [date, setDate] = useState("");
    const [studentId, setStudentId] = useState(-1);
    const [amount, setAmount] = useState(0);
    const [received, setReceived] = useState(0);
    const [students, setStudents] = useState([]);

    async function getStudents() {
        fetch("/api/students")
        .then(response => response.json())
        .then(data => setStudents(data))
    }

    useEffect(() => {
        getStudents();
    }, []);

    function closeModal() {
        setIsModalOpen(false);
        setDate("");
        setStudentId(-1);
        setAmount(0);
        setReceived(0);
    }

    console.log(students);

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const income = {
            date: date,
            student_id: studentId,
            amount: amount,
            received: received
        }
        
        console.log(income);
        fetch("/api/finances", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(income)
        }).then(() => {
            getFinances();
        });
        closeModal();
    }

    return (
        <>
            <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>Add Income</button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full">
                    <h3 className="font-bold text-lg">Add New Income</h3>
                    <div className="modal-action w-full">
                        <label className="label">
                            <span className="label-text">Student</span>
                        </label>
                        <select className="select select-bordered w-full max-w-xs" defaultValue={-1} value={studentId} onChange={e => {setStudentId(parseInt(e.target.value))}}>
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
                            <span className="label-text">Date</span>
                        </label>
                        <input type="text" value={date} placeholder="YYYY-MM-DD" onChange={e => {setDate(e.target.value)}}  className="input input-md input-bordered w-full max-w-xs" />
                    </div>
                    <div className="modal-action w-full">
                        <label className="label">
                            <span className="label-text">Amount (KRW)</span>
                        </label>
                        <input type="number" value={amount} placeholder="Enter Amount" onChange={e => {setAmount(parseInt(e.target.value))}} className="input input-md input-bordered w-full max-w-xs" />
                    </div>
                    <div className="modal-action w-full">
                        <label className="label">
                            <span className="label-text">Received</span>
                        </label>
                        <select value={received} onChange={e => {setReceived(parseInt(e.target.value))}} className="select select-bordered w-full max-w-xs">
                            <option key={0} value={0}>No</option>
                            <option key={1} value={1}>Yes</option>
                        </select>
                    </div>
                    <div className="modal-action">
                        <button type="reset" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="btn">Add</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default function Finances() {
    const [finances, setFinances] = useState([]);

    async function getFinances() {
        fetch("/api/finances")
        .then(response => response.json())
        .then(data => setFinances(data))
    }

    useEffect(() => {
        getFinances();
    }, []);

    console.log(finances);

    return (
        <div className={styles.container}>
            <div className={styles.financeActions}>
                <AddIncome getFinances={getFinances} />
            </div>
            <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th>Date</th> 
                            <th>Student</th> 
                            <th>Amount (KRW)</th> 
                            <th>Received</th> 
                        </tr>
                    </thead> 
                    <tbody>
                        {
                            finances.map((value: IncomeEntry, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{value.date.split("T")[0]}</td>
                                        <td>{value.name}</td>
                                        <td>{value.amount}</td>
                                        <td>{value.received === 0 ? "No" : "Yes"}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody> 
                </table>
            </div>
        </div>
    )
}