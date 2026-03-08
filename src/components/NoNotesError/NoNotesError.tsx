import css from "./NoNotesError.module.css";

export default function NoNotesError() {
    return (
        <p className={css.text}>No notes found, please search for another note or create one...</p>
    );
}