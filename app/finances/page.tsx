"use client"

import styles from './finances.module.css';
import Modal from '../components/Modal';
import { useState, useEffect, FormEventHandler } from 'react';

interface AddIncomeProps {
    getFinances: () => Promise<void>
}

function AddIncome({ getFinances }: AddIncomeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [studentId, setStudentId] = useState(null);
    const [amount, setAmount] = useState(0);
    const [received, setReceived] = useState(false);

    function closeModal() {
        setIsModalOpen(false);
        setDate(new Date());
        setStudentId(null);
        setAmount(0);
        setReceived(false);
    }

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

    function handleDateChange() {
        
    }

    return (
        <>
            <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>Add Income</button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd}>
                    <h3 className="font-bold text-lg">Add New Income</h3>
                    <div className="modal-action">
                        
                    </div>
                    <div className="modal-action">
                        <button type="reset" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="btn">Add Income</button>
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
                            <th>Name</th> 
                            <th>Amount (KRW)</th> 
                            <th>Received</th> 
                        </tr>
                    </thead> 
                    <tbody>
                        <tr>
                            <th>05/19/2023</th> 
                            <td>Jane</td> 
                            <td>50,000</td> 
                            <td>No</td> 
                        </tr>
                    </tbody> 
                </table>
            </div>
        </div>
    )
}