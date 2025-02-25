import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Contact, Company } from '../../types';

interface ContactsState {
  contacts: Contact[];
  companies: Company[];
  selectedContact: Contact | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  companies: [],
  selectedContact: null,
  isLoading: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (workspaceId: string) => {
    const response = await axios.get(`/api/contacts?workspaceId=${workspaceId}`);
    return response.data;
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: Partial<Contact>) => {
    const response = await axios.post('/api/contacts', contactData);
    return response.data;
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload);
    },
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      });
  },
});

export const { setSelectedContact, addContact, updateContact } = contactsSlice.actions;
export default contactsSlice.reducer;