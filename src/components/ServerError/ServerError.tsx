import css from "./ServerError.module.css";

export default function ServerError() {
    return (
        <p className={css.text}>There was an error, please try again...</p>
    );
}