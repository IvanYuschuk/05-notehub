import ReactPaginate from "react-paginate";
import css from './Pagination.module.css';

interface PaginationProps {
    totalPages: number;
    forcePage: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ totalPages, forcePage, onPageChange }: PaginationProps) {
    return (
        <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            forcePage={forcePage - 1} 
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />
    )
 }