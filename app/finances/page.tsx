"use client"

import styles from './finances.module.css';
import Modal from '../components/Modal';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { AiOutlinePlus } from 'react-icons/ai';
import { useState, useEffect, FormEventHandler } from 'react';

type Student = {
    id: number,
    name: string,
    subject: string
}

type IncomeEntry = {
    id: number,
    date: string,
    student_name: string,
    student_id: number,
    amount: number,
    received: number
}

interface ModifyIncomeProps {
    getFinances: () => Promise<void>,
    incomeEntry: IncomeEntry
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

    function openModal() {
        setIsModalOpen(true);
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
        setIsModalOpen(false);
    }

    return (
        <>
            <div className="tooltip" data-tip="Add Income">
                <div className="shadow-md rounded-full p-3 mx-2 hover:bg-gray-50 cursor-pointer" onClick={openModal}>
                    <AiOutlinePlus size={24} className="text-green-500" />
                </div>
            </div>
            {/* <button className="btn btn-success" onClick={openModal}>Add Income <AiOutlinePlus size={20}/></button> */}
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full">
                    <h3 className="font-bold text-lg">Add New Income</h3>
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
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn">Add</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

function DeleteIncome({getFinances, incomeEntry}: ModifyIncomeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleDelete() {
        console.log(incomeEntry);
        fetch(`/api/finances/${incomeEntry.id}`, {
            method: "DELETE",
        }).then(() => {
            getFinances();
        });
        setIsModalOpen(false);
    }

    return (
        <>
            <div className="tooltip" data-tip="Delete Income">
                <div className="shadow rounded-full p-3 mx-2">
                    <HiOutlineTrash cursor="pointer" size={24} className="text-red-500" onClick={() => setIsModalOpen(true)}/>
                </div>
            </div>
            <Modal isModalOpen={isModalOpen}>
                <h3 className="font-bold text-lg text-center">Are you sure you want to delete this?</h3>
                <div className="text-center">
                    <div className="my-5 inline-block text-left">
                        <p><b>Date: </b>{incomeEntry.date}</p>
                        <p><b>Student: </b>{incomeEntry.student_name}</p>
                        <p><b>Amount: </b>{incomeEntry.amount} KRW</p>
                        <p><b>Received: </b>{incomeEntry.received === 0 ? "No" : "Yes"}</p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="btn ml-2 btn-accent" onClick={() => handleDelete()}>Yes, I'm sure</button>
                </div>
            </Modal>
        </>
    )
}

function EditIncome({getFinances, incomeEntry}: ModifyIncomeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [date, setDate] = useState(incomeEntry.date);
    const [studentId, setStudentId] = useState(incomeEntry.student_id);
    const [amount, setAmount] = useState(incomeEntry.amount);
    const [received, setReceived] = useState(incomeEntry.received);
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
        setDate(incomeEntry.date);
        setStudentId(incomeEntry.student_id);
        setAmount(incomeEntry.amount);
        setReceived(incomeEntry.received);
    }

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const editIncome = {
            date: date,
            student_id: studentId,
            amount: amount,
            received: received
        }

        console.log(editIncome);
        fetch(`/api/finances/${incomeEntry.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(editIncome)
        }).then(() => {
            getFinances();
        });

        setIsModalOpen(false);
    }

    return (
        <>
            <div className="tooltip" data-tip="Edit Income">
                <div className="shadow rounded-full p-3 mx-2">
                    <HiOutlinePencil cursor="pointer" size={24} className="text-blue-500" onClick={openModal}/>
                </div>
            </div>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full">
                    <h3 className="font-bold text-lg">Edit Income</h3>
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
                        <button type="reset" className="btn btn-ghost" onClick={() => {setIsModalOpen(false)}}>Cancel</button>
                        <button type="submit" className="btn">Save Changes</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

function addCommas(number: number) {
    // Convert the number to a string with commas
    const formattedNumber = number.toLocaleString();
  
    // Remove any existing commas before adding new ones
    const numberWithCommas = formattedNumber.replace(/,/g, '');
  
    // Add commas every three digits using a regular expression
    const numberWithCommasFormatted = numberWithCommas.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return numberWithCommasFormatted;
}

export default function Finances() {
    const [finances, setFinances] = useState([]);
    const [students, setStudents] = useState([]);
    const [value, setValue] = useState<IncomeEntry>({ id: 0,
        date: "",
        student_name: "",
        student_id: 0,
        amount: 0,
        received: 0});

    async function getStudents() {
        fetch("/api/students")
        .then(response => response.json())
        .then(data => setStudents(data))
    }

    async function getFinances() {
        fetch("/api/finances")
        .then(response => response.json())
        .then(data => setFinances(data))
    }

    useEffect(() => {
        getFinances();
        getStudents();
    }, []);

    console.log(finances);

    function getUniqueDates(substringStart: number, substringEnd: number) {
        const getDates = finances.map((income: IncomeEntry) => income.date.substring(substringStart, substringEnd));
        const getUniqueDates = new Set(getDates);
        return Array.from(getUniqueDates);
    }

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div className="stats shadow mr-5">
                    <div className="stat">
                        <div className="stat-title">Total</div>
                        <div className="stat-value">{addCommas(finances.reduce((acc, income: IncomeEntry) => acc + income.amount, 0))} KRW</div>
                        <div className="flex">
                            <div className="stat-desc text-green-500 mr-8">{addCommas(finances.filter((income: IncomeEntry) => income.received === 1).reduce((acc, income: IncomeEntry) => acc + income.amount, 0))} KRW received</div>
                            <div className="stat-desc text-red-500">{addCommas(finances.filter((income: IncomeEntry) => income.received === 0).reduce((acc, income: IncomeEntry) => acc + income.amount, 0))} KRW not received</div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.filterActions} shadow`}>
                    <select className="select select-sm select-bordered max-w-xs mr-5">
                        <option selected>All Years</option>
                        { 
                            getUniqueDates(0, 4).map((year) => {
                                return <option>{year}</option>
                            })
                        }
                    </select>
                    <select className="select select-sm select-bordered max-w-xs mr-5">
                        <option selected>All Months</option>
                        {    
                            getUniqueDates(5, 7).map((month) => {
                                return <option>{month}</option>
                            })
                        }
                    </select>
                    <select className="select select-sm select-bordered max-w-xs mr-5">
                        <option selected>All Students</option>
                        { 
                            students.map((student: Student) => {
                                return <option>{student.name}</option>
                            })
                        }
                    </select>
                    <button className="btn btn-sm">Filter</button>
                </div>
                <div className={styles.financeActionsContainer}>
                    <AddIncome getFinances={getFinances} />
                    <EditIncome getFinances={getFinances} incomeEntry={value} />
                    <DeleteIncome getFinances={getFinances} incomeEntry={value}/>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th>Date</th> 
                            <th>Student</th> 
                            <th>Amount (KRW)</th> 
                            <th>Received</th>
                            {/* <th>Actions</th>  */}
                        </tr>
                    </thead> 
                    <tbody>
                        {
                            finances.map((value: IncomeEntry, index) => {
                                return (
                                    <tr className="bg-red-200" key={index}>
                                        <td>{value.date.split("T")[0]}</td>
                                        <td>{value.student_name}</td>
                                        <td>{addCommas(value.amount)}</td>
                                        <td className={value.received === 0 ? "bg-red-200" : "bg-green-200"}>{value.received === 0 ? "No" : "Yes"}</td>
                                        {/* <td className="flex gap-5">
                                            <EditIncome getFinances={getFinances} incomeEntry={value} />
                                            <DeleteIncome getFinances={getFinances} incomeEntry={value}/>
                                        </td> */}
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