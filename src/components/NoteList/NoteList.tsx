
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import { toast } from "react-hot-toast";

interface NoteListProps {
    notes: Note[];
}

const deleteToast = () => toast.success('Note deleted successfully!');
const deleteToastError = () => toast.error('Failed to delete the note. Please try later.');

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
		mutationFn: deleteNote,
		onSuccess: () => {
			deleteToast();
			queryClient.invalidateQueries({ queryKey: ['notes'] });
		},
		onError: () => {
			deleteToastError();
		}
	});
	
	const onDelete = (id: string) => {
		deleteMutation.mutate(id);
	}

    return (
        <ul className={css.list}>
            {notes.map(note => (
            <li key={note.id} className={css.listItem}>
            <h2 className={css.title}> {note.title} </h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button className={css.button} onClick={() => onDelete(note.id)}>Delete</button>
            </div>
          </li>
        ))}
        </ul>
    )
 }