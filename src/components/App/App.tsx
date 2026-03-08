import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';
import { useEffect, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {  createNote, deleteNote, fetchNotes } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import type { Note } from '../../types/note';
import ServerError from '../ServerError/ServerError';
import Loader from '../Loader/Loader';
import NoNotesError from '../NoNotesError/NoNotesError';
import { toast, Toaster } from 'react-hot-toast';

const delateToast = () => toast.success('Note deleted successfully!');
const delateToastError = () => toast.error('Failed to delete the note. Please try later.');
const createToast = () => toast.success('Note created successfully!');
const createToastError = () => toast.error('Failed to create the note. Please try later.');

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
    
	useEffect(() => {
		console.log('Search query:', nameNote);
	 }, [nameNote]);
    
	
	const [modalOpen, setModalOpen] = useState(false);
	
	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);
    

	const queryClient = useQueryClient();

	const delateMutation = useMutation({
		mutationFn: deleteNote,
		onSuccess: () => {
			delateToast();
			queryClient.invalidateQueries({ queryKey: ['notes', nameNote, page] });
		},
		onError: () => {
			delateToastError();
		}
	});
	
	const onDelete = (id: string) => {
		delateMutation.mutate(id);
	}

	const createMutation = useMutation({
		mutationFn: createNote,
		onSuccess: () => {
			createToast();
			queryClient.invalidateQueries({ queryKey: ['notes', nameNote, page] });
		},
		onError: () => {
			createToastError();
		}
	});

	const onCreare = ({title, content, tag}: Omit<Note, 'id'>) => {
		createMutation.mutate({title, content, tag});
	}

	return (
        <div className={css.app}>
	        <header className={css.toolbar}>
		        <SearchBox value={nameNote} onChange={handleSearchChange} />
				{data && data.totalPages > 1 && (
					<Pagination totalPages={totalPages} setCurrentPage={setPage} />
				)}
		        <button className={css.button} onClick={openModal}>Create note +</button>
			</header>
			{isLoading && <Loader />}
			{isError && <ServerError />}
			{data && data.notes.length === 0 && <NoNotesError/>}
			{isSuccess && data && (<NoteList notes={data.notes} onDelete={onDelete}/>)}
			{modalOpen && <Modal onClose={closeModal} onCreate={onCreare} />}
			<Toaster />
        </div>
   )
}