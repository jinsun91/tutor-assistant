interface ModalProps {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
    children: React.ReactNode
}

export default function Modal({ isModalOpen, setIsModalOpen, children }: ModalProps) {
    return (
        <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
            <div className="modal-box relative">
                <label className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setIsModalOpen(false)}>✕</label>
                {children}
            </div>
        </div>
    )
}