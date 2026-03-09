import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import ServerError from '../ServerError/ServerError';
import Loader from '../Loader/Loader';
import NoNotesError from '../NoNotesError/NoNotesError';
import {  Toaster } from 'react-hot-toast';




export default function App() { 
   
	const [nameNote, setNameNote] = useState('');
	const [page, setPage] = useState(1);
	
	const {data, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['notes', nameNote, page],
		queryFn: () => fetchNotes({ searchNote: nameNote, page }),
		placeholderData: keepPreviousData,
	})

	const totalPages = data?.totalPages || 0;
	
	const handleSearchChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setNameNote(event.target.value);
		setPage(1); 
	}, 300);

	const onPageChange = (page: number) => {
		setPage(page); 
	}
    
	
	
	const [modalOpen, setModalOpen] = useState(false);
	
	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
    

	


	

	return (
        <div className={css.app}>
	        <header className={css.toolbar}>
		        <SearchBox onChange={handleSearchChange} />
				{data && data.totalPages > 1 && (
					<Pagination totalPages={totalPages} forcePage={page} onPageChange={onPageChange}/>
				)}
		        <button className={css.button} onClick={openModal}>Create note +</button>
			</header>
			{isLoading && <Loader />}
			{isError && <ServerError />}
			{data && data.notes.length === 0 && <NoNotesError/>}
			{isSuccess && data && (<NoteList notes={data.notes} />)}
			{modalOpen && (
				<Modal onClose={closeModal}>
					<NoteForm onClose={closeModal} />
				</Modal>)}
			<Toaster />
        </div>
   )
}