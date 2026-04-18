import { request } from './http';
import type { Note } from '../types/note';

type NotePayload = {
	title: string;
	description: string;
};

export function getNotes(): Promise<Note[]> {
	return request<Note[]>('/apis/notes', { auth: true });
}

export function createNote(payload: NotePayload): Promise<Note> {
	return request<Note>('/apis/notes', {
		method: 'POST',
		auth: true,
		body: JSON.stringify(payload),
	});
}

export function updateNote(id: number, payload: NotePayload): Promise<Note> {
	return request<Note>(`/apis/notes/${id}`, {
		method: 'PUT',
		auth: true,
		body: JSON.stringify(payload),
	});
}

export function deleteNote(id: number): Promise<void> {
	return request<void>(`/apis/notes/${id}`, {
		method: 'DELETE',
		auth: true,
	});
}
