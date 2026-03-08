import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import NoteForm from '../NoteForm/NoteForm';
import { useEffect } from 'react';
import type { Note } from '../../types/note';

interface ModalProps {
    onClose: () => void
    onCreate: (note: Omit<Note, 'id'>) => void;
 }

export default function Modal({ onClose, onCreate }: ModalProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
         }
     }, [onClose])

    return createPortal(
        <div
           className={css.backdrop}
           role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
         >
            <div className={css.modal}>
                <NoteForm onClose={onClose} onCreate={onCreate} />
           </div>
        </div>,
        document.body
    )
}