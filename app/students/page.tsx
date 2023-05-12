import { AiOutlinePlus } from 'react-icons/ai';
import styles from './students.module.css';

function StudentList() {
    return (
        <ul className={"menu bg-base-100 " + `${styles.studentList}`}>
            <li><a>Item 1</a></li>
            <li><a className="active">Item 2</a></li>
            <li><a>Item 3</a></li>
        </ul>
    );
}

function StudentInfo() {
    return (
        <div className={styles.studentInfo}>

        </div>
    )
}

export default function Students() {
    return (
        <div className={styles.container}>
            <div className={styles.studentListSection}>
                <StudentList />
                <button className="btn btn-outline w-full">Add New Student <AiOutlinePlus size={20} /></button>
            </div>
            <div className={styles.studentInfoSection}>
                <StudentInfo />
            </div>
        </div>
    )
}