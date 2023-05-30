"use client"

import styles from './finances.module.css';
import Modal from '../components/Modal';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImCheckmark, ImCross } from 'react-icons/im';
import { BsTrash3Fill } from 'react-icons/bs';
import { useState, useEffect, FormEventHandler, ChangeEvent } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { formatIncome } from '../../utils/formatting';
import { FaFileInvoiceDollar } from 'react-icons/fa';

type Student = {
    id: number,
    name: string,
    subject: string
}

type IncomeEntry = {
    id: number,
    date: Dayjs,
    student_name: string,
    student_id: number,
    amount: number,
    received: number,
    isSelected: boolean
}

interface EditIncomeProps {
    getFinances: () => Promise<void>,
    incomeEntry: IncomeEntry
}

interface DeleteIncomeProps {
    getFinances: () => Promise<void>,
    selectedEntries: IncomeEntry[],
    setAllRowsSelected: (val: boolean) => void,
}

interface InvoiceProps {
    getFinances: () => Promise<void>,
    selectedEntries: IncomeEntry[],
    setAllRowsSelected: (val: boolean) => void,
}

interface MarkReceivedProps {
    isReceived: number,
    getFinances: () => Promise<void>,
    selectedEntries: IncomeEntry[],
    setAllRowsSelected: (val: boolean) => void,
}

interface AddIncomeProps {
    getFinances: () => Promise<void>
}

function AddIncome({ getFinances }: AddIncomeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [date, setDate] = useState(dayjs(Date.now()));
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
        setDate(dayjs(Date.now()));
        setStudentId(-1);
        setAmount(0);
        setReceived(0);
    }

    console.log(students);

    const handleAdd: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const income = {
            date: date?.format("YYYY-MM-DD"),
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

    function handleDateChange(newValue: Dayjs | null) {
        if (newValue !== null) {
            setDate(newValue);
        }
    }

    return (
        <>
            <button className="btn btn-sm btn-outline btn-info" onClick={openModal}>Add New Income</button>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full px-2">
                    <h3 className="font-bold text-lg">Add New Income</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Student</div>
                        <div>
                            <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={e => {setStudentId(parseInt(e.target.value))}}>
                                <option value={-1} disabled>Choose Student</option>
                                {
                                    students.map((student: Student) => {
                                        return <option key={student.id} value={student.id}>{student.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className={styles.modalLabels}>Date</div>
                        <div>
                            <DatePicker className="w-full" value={date} onChange={handleDateChange}/>
                        </div>
                        <div className={styles.modalLabels}>Amount</div>
                        <div>
                            <label className="input-group">
                                <span>$</span>
                                <input type="number" value={amount} placeholder="Enter Amount" onChange={e => {setAmount(parseFloat(e.target.value))}} className="input input-md input-bordered w-full max-w-xs" />
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Received</div>
                        <div>
                            <select value={received} onChange={e => {setReceived(parseInt(e.target.value))}} className="select select-bordered w-full max-w-xs">
                                <option key={0} value={0}>No</option>
                                <option key={1} value={1}>Yes</option>
                            </select>
                        </div>
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

function DeleteIncome({getFinances, selectedEntries, setAllRowsSelected}: DeleteIncomeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const selectedEntriesIds = selectedEntries.map((entry) => entry.id);

    function handleDelete() {
        fetch("/api/finances/deletes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(selectedEntriesIds),
        }).then(() => {
            getFinances();
        });
        setIsModalOpen(false);
        setAllRowsSelected(false);
    }

    return (
        <>
            <div className="tooltip" data-tip="Delete Income">
                <div className="shadow-md rounded-xl p-2.5 mx-1 hover:bg-gray-50 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <BsTrash3Fill cursor="pointer" size={23} className="text-gray-500" />
                </div>
            </div>
            <Modal isModalOpen={isModalOpen}>
                <h3 className="font-bold text-lg text-center">Are you sure you want to delete {selectedEntries.length} {selectedEntries.length == 1 ? "item" : "items"}?</h3>
                <div className="flex justify-center">
                    <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="btn ml-2 btn-accent" onClick={() => handleDelete()}>Yes, I'm sure</button>
                </div>
            </Modal>
        </>
    )
}

function MarkReceived({isReceived, getFinances, selectedEntries, setAllRowsSelected}: MarkReceivedProps) {

    function handleMarkReceived() {
        if (selectedEntries.length > 0) {
            const selectedEntriesIds = selectedEntries.map((entry) => entry.id);

            const requestPayload = {
                isReceived: isReceived,
                selectedEntries: selectedEntriesIds
            }

            fetch("/api/finances", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestPayload),
            }).then(() => {
                getFinances();
            });
            setAllRowsSelected(false);
        }
    }

    return (
        <>
            <div className="tooltip" data-tip={isReceived === 0 ? "Mark as Not Received" : "Mark as Received"}>
                <div className="shadow-md rounded-xl p-2.5 mx-1 hover:bg-gray-50 cursor-pointer" onClick={handleMarkReceived}>
                    { isReceived === 0 ? <ImCross size={23} className="text-red-500" /> : <ImCheckmark size={23} className="text-green-500" />}
                </div>
            </div>
        </>
    )
}

function EditIncome({getFinances, incomeEntry}: EditIncomeProps) {
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
            date: date?.format("YYYY-MM-DD"),
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

    function handleDateChange(newValue: Dayjs | null) {
        if (newValue !== null) {
            setDate(newValue);
        }
    }

    return (
        <>
            <HiOutlinePencil cursor="pointer" size={20} className="text-blue-500" onClick={openModal}/>
            <Modal isModalOpen={isModalOpen}>
                <form onSubmit={handleAdd} className="w-full px-2">
                    <h3 className="font-bold text-lg">Edit Income</h3>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalLabels}>Student</div>
                        <div>
                            <select className="select select-bordered w-full max-w-xs" value={studentId} onChange={e => {setStudentId(parseInt(e.target.value))}}>
                                <option value={-1} disabled>Choose Student</option>
                                {
                                    students.map((student: Student) => {
                                        return <option key={student.id} value={student.id}>{student.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className={styles.modalLabels}>Date</div>
                        <div>
                            <DatePicker className="w-full" value={date} onChange={handleDateChange}/>
                        </div>
                        <div className={styles.modalLabels}>Amount</div>
                        <div>
                            <label className="input-group">
                                <span>$</span>
                                <input type="number" value={amount} placeholder="Enter Amount" onChange={e => {setAmount(parseFloat(e.target.value))}} className="input input-md input-bordered w-full max-w-xs" />
                            </label>
                        </div>
                        <div className={styles.modalLabels}>Received</div>
                        <div>
                            <select value={received} onChange={e => {setReceived(parseInt(e.target.value))}} className="select select-bordered w-full max-w-xs">
                                <option key={0} value={0}>No</option>
                                <option key={1} value={1}>Yes</option>
                            </select>
                        </div>
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

function Invoice({getFinances, selectedEntries, setAllRowsSelected}: InvoiceProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invoice, setInvoice] = useState("");

    function writeInvoice() {
        console.log("HEREEEE")
        console.log(selectedEntries);
        let invoiceStr = "";
        for (let i = 0; i < selectedEntries.length; i++) {
            invoiceStr += dayjs(selectedEntries[i].date).format("MMM DD") + " - $" + formatIncome(selectedEntries[i].amount) + "\n";
        }
        invoiceStr += "Total: $" + formatIncome(selectedEntries.reduce((acc, income: IncomeEntry) => acc + income.amount, 0));
        return invoiceStr;
    }

    function openModal() {
        setIsModalOpen(true);
        setInvoice(writeInvoice());
    }

    useEffect(() => {
        setInvoice(writeInvoice());
    }, []);

    function handleCopy() {
        navigator.clipboard.writeText(invoice);
    }

    return (
        <>
            <div className="tooltip" data-tip={"Create Invoice"}>
                <div className="shadow-md rounded-xl p-2.5 mx-1 hover:bg-gray-50 cursor-pointer" onClick={openModal}>
                    <FaFileInvoiceDollar size={23} className="text-yellow-500" />
                </div>
            </div>
            <Modal isModalOpen={isModalOpen}>
                <div className="w-full">
                    <div className={styles.displayLineBreak}>
                        {invoice}
                    </div>
                    <div>
                        <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Close</button>
                        <button className="btn" onClick={handleCopy}>Copy</button>
                    </div>
                </div>            
            </Modal>
        </>
    )
}

export default function Finances() {
    const [finances, setFinances] = useState<IncomeEntry[]>([]);
    const [students, setStudents] = useState([]);
    const [allRowsSelected, setAllRowsSelected] = useState(false);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState("0");
    const [studentId, setStudentId] = useState(-1);
    const [filteredFinances, setFilteredFinances] = useState<IncomeEntry[]>([]);

    async function getStudents() {
        fetch("/api/students")
        .then(response => response.json())
        .then(data => setStudents(data))
    }

    async function getFinances() {
        fetch("/api/finances")
        .then(response => response.json())
        .then(data => {
            const rows = data.map((income: IncomeEntry) => {
                return {...income, date: dayjs(income.date), isSelected: false}
            });
            setFinances(rows);
            setFilteredFinances(filterEntries(year, month, studentId, rows));
        })
    }

    useEffect(() => {
        getFinances();
        getStudents();
    }, []);

    console.log(finances);

    const selectedRows = filteredFinances.filter((entry: IncomeEntry) => entry.isSelected);
    console.log(selectedRows);

    function getUniqueYears() {
        const getDates = finances.map((income: IncomeEntry) => income.date.format("YYYY"));
        const getUniqueDates = new Set(getDates);
        return Array.from(getUniqueDates);
    }

    function getUniqueMonths() {
        const getDates = finances.map((income: IncomeEntry) => income.date.format("MMM"));
        const getUniqueDates = new Set(getDates);
        return Array.from(getUniqueDates);
    }

    function handleIncomeSelectChange(e: ChangeEvent<HTMLInputElement>, index: number, value: IncomeEntry) {
        console.log(e.target.checked);
        const newFinances: IncomeEntry[] = [...filteredFinances];
        newFinances[index] = {...value, isSelected: e.target.checked};
        setFilteredFinances(newFinances);

        if (e.target.checked === false && allRowsSelected === true) {
            setAllRowsSelected(false);
        }
    }

    function selectAllRows(e: ChangeEvent<HTMLInputElement>) {
        const newFinances = filteredFinances.map((income: IncomeEntry) => {
            return {
                ...income, 
                isSelected: e.target.checked
            }});
        setFilteredFinances(newFinances);
        setAllRowsSelected(e.target.checked);
    }

    function filterEntries(year: number, month: string, studentId: number, entries: IncomeEntry[]) {
        let filteredEntries = [...entries];
        console.log(filterEntries);
        if (year != 0) {
            console.log("Enter year");
            filteredEntries = filteredEntries.filter((entry) => parseInt(entry.date.format("YYYY")) === year);
        }

        if (month !== "0") {
            console.log("Enter month");
            console.log(month);
            filteredEntries = filteredEntries.filter((entry) => entry.date.format("MMM") === month);
        }

        if (studentId != -1) {
            console.log("Enter student");
            console.log(studentId);
            filteredEntries = filteredEntries.filter((entry) => entry.student_id === studentId);
        }
        console.log(filteredEntries);
        return filteredEntries;
    }

    function handleFilterEntries() {
        setFilteredFinances(filterEntries(year, month, studentId, finances));
    }

    function showAllEntries() {
        setFilteredFinances(finances);
        setYear(0);
        setMonth("0");
        setStudentId(-1);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <div className="stats shadow mr-5 mb-5 w-72">
                        <div className="stat">
                            <div className="stat-title">Total</div>
                            <div className="stat-value mt-2">${formatIncome(filteredFinances.reduce((acc, income: IncomeEntry) => acc + income.amount, 0))}</div>
                            <div className="mt-3">
                                <div className="stat-desc text-green-500 mr-8">${formatIncome(filteredFinances.filter((income: IncomeEntry) => income.received === 1).reduce((acc, income: IncomeEntry) => acc + income.amount, 0))} received</div>
                                <div className="stat-desc text-red-500">${formatIncome(filteredFinances.filter((income: IncomeEntry) => income.received === 0).reduce((acc, income: IncomeEntry) => acc + income.amount, 0))} not received</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.filterActions} shadow -ml-5`}>
                        <select className="select select-sm select-bordered max-w-xs mr-5" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                            <option value={0}>All Years</option>
                            { 
                                getUniqueYears().map((year) => {
                                    return <option key={year} value={year}>{year}</option>
                                })
                            }
                        </select>
                        <select className="select select-sm select-bordered max-w-xs mr-5" value={month} onChange={(e) => setMonth(e.target.value)}>
                            <option value={"0"}>All Months</option>
                            {    
                                getUniqueMonths().map((month) => {
                                    return <option key={month} value={month}>{month}</option>
                                })
                            }
                        </select>
                        <select className="select select-sm select-bordered max-w-xs mr-5" value={studentId} onChange={(e) => setStudentId(parseInt(e.target.value))}>
                            <option value={-1}>All Students</option>
                            { 
                                students.map((student: Student) => {
                                    return <option key={student.id} value={student.id}>{student.name}</option>
                                })
                            }
                        </select>
                        <button className="btn btn-sm" onClick={handleFilterEntries}>Filter</button>
                        <button className="btn btn-sm ml-2" onClick={showAllEntries}>Show All</button>
                    </div>
                    <div className={styles.financeActionsOuterContainer}>
                        <AddIncome getFinances={getFinances} />
                        <div className={styles.financeActionsContainer}>
                            <Invoice getFinances={getFinances} selectedEntries={selectedRows} setAllRowsSelected={setAllRowsSelected} />
                            <DeleteIncome getFinances={getFinances} selectedEntries={selectedRows} setAllRowsSelected={setAllRowsSelected}/>
                            <MarkReceived isReceived={1} getFinances={getFinances} selectedEntries={selectedRows} setAllRowsSelected={setAllRowsSelected}/>
                            <MarkReceived isReceived={0} getFinances={getFinances} selectedEntries={selectedRows} setAllRowsSelected={setAllRowsSelected}/>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" checked={allRowsSelected} className="checkbox checkbox-sm" onChange={selectAllRows} />
                                    </label>
                                </th>
                                <th>Date</th> 
                                <th>Student</th> 
                                <th>Amount</th>
                                <th>Received</th>
                                <th>Edit</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {
                                filteredFinances.map((value: IncomeEntry, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <label>
                                                    <input type="checkbox" checked={value.isSelected} className="checkbox checkbox-sm" onChange={(e) => handleIncomeSelectChange(e, index, value)}/>
                                                </label>
                                            </td>
                                            <td>{value.date.format("MMM DD, YYYY")}</td>
                                            <td>{value.student_name}</td>
                                            <td>${formatIncome(value.amount)}</td>
                                            <td className={value.received === 0 ? "bg-red-200" : "bg-green-200"}>{value.received === 0 ? "No" : "Yes"}</td>
                                            <td><EditIncome getFinances={getFinances} incomeEntry={value} /></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody> 
                    </table>
                </div>
            </div>
        </LocalizationProvider>
    )
}