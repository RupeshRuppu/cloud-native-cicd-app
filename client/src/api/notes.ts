import { request } from "./http";
import type { Note } from "../types/note";

type NotePayload = {
  title: string;
  description: string;
};

export function getNotes(): Promise<Note[]> {
  return request<Note[]>("notes", { auth: true });
}

export function createNote(payload: NotePayload): Promise<Note> {
  return request<Note>("notes", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function updateNote(id: number, payload: NotePayload): Promise<Note> {
  return request<Note>(`notes/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function deleteNote(id: number): Promise<void> {
  return request<void>(`notes/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
