interface ModalProps {
    isModalOpen: boolean,
    children: React.ReactNode
}

export default function Modal({ isModalOpen, children }: ModalProps) {
    return (
        <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
            <div className="modal-box relative">
                {children}
            </div>
        </div>
    )
}