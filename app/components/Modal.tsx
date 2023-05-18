interface ModalProps {
    isModalOpen: boolean,
    closeModal: () => void,
    children: React.ReactNode
}

export default function Modal({ isModalOpen, closeModal, children }: ModalProps) {
    return (
        <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
            <div className="modal-box relative">
                <label className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => closeModal()}>✕</label>
                {children}
            </div>
        </div>
    )
}