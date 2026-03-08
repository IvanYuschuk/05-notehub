import axios from "axios";
import type { Note } from "../types/note";

interface FetchNotesProps {
    searchNote: string;
    page: number;
}

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export async function fetchNotes({ searchNote, page }: FetchNotesProps) {
    const res = await axios.get<FetchNotesResponse>('https://notehub-public.goit.study/api/notes', {
        params: {
            search: searchNote,
            page: page,
            perPage: 12,
        },
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
        },
    });

    return res.data;
}



export async function deleteNote(id: string): Promise<void> {
    const delate = await axios.delete(`https://notehub-public.goit.study/api/notes/${id}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
        },
    });
    
    return delate.data;
}


export async function createNote({ title, content, tag }: Omit<Note, 'id'>) {
    const create = await axios.post('https://notehub-public.goit.study/api/notes', {
        title,
        content,
        tag,
    }, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_AUTHORIZATION_TOKEN}`,
        }
    }
    );

    return create.data;    
 }