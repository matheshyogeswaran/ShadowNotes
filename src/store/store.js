import create from 'zustand';

const useNoteStore = create(set => ({
  notes: [], // Array of notes
  likedNotes: new Set(), // Store liked note IDs

  // Action to toggle like
  toggleLike: id =>
    set(state => {
      const updatedLikedNotes = new Set(state.likedNotes);
      if (updatedLikedNotes.has(id)) {
        updatedLikedNotes.delete(id); // Unlike the note
      } else {
        updatedLikedNotes.add(id); // Like the note
      }
      return { likedNotes: updatedLikedNotes };
    }),

  // Action to initialize notes
  setNotes: notes => set({ notes }),
}));
export default useNoteStore;
