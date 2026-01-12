import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  collection,
  Firestore,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService implements OnDestroy {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash?: () => void;
  unsubNotes?: () => void;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.error('Error deleting document: ', err);
    });
  }

  async updateNote(note: Note) {
    if (note.id) {
      const docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {
        console.error('Error updating document: ', err);
      });
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note): 'notes' | 'trash' {
    return note.type === 'note' ? 'notes' : 'trash';
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    const colRef = colId === 'trash' ? this.getTrashRef() : this.getNotesRef();

    await addDoc(colRef, this.getCleanJson(item) as any)
      .catch((err) => {
        console.error('Error adding document: ', err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  ngOnDestroy() {
    this.unsubNotes?.();
    this.unsubTrash?.();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObjects(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObjects(element.data(), element.id));
      });
    });
  }

  setNoteObjects(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
