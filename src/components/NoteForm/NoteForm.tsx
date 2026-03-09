import { Formik, Form, Field, ErrorMessage} from 'formik';
import css from './NoteForm.module.css';
import { useId } from 'react';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import { toast } from 'react-hot-toast';
import type { Note } from '../../types/note';

interface NoteFormProps {
    onClose: () => void;
}
 
const NoteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .required('Title is required'),
    content: Yup.string()
        .max(500, 'Content must be less than 50 characters'),
     tag: Yup.string()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
        .required('Tag is required'),
});

type NoteFormValues  = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

const initialValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
}

const createToast = () => toast.success('Note created successfully!');
const createToastError = () => toast.error('Failed to create the note. Please try later.');

export default function NoteForm({ onClose}: NoteFormProps) {
    const formId = useId();
    
    const queryClient = useQueryClient();

    const createMutation = useMutation({
		mutationFn: createNote,
		onSuccess: () => {
			createToast();
			queryClient.invalidateQueries({ queryKey: ['notes'] });
		},
		onError: () => {
			createToastError();
		}
	});

	const onCreate = ({title, content, tag}: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
		createMutation.mutate({title, content, tag});
	}

    const handleSubmit = (values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
        console.log(values);
        actions.resetForm();
        onCreate(values);
        onClose();
     }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={NoteFormSchema}>
        <Form className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor={`${formId}-title`}>Title</label>
    <Field id={`${formId}-title`} type="text" name="title" className={css.input} />
     <ErrorMessage component="span" name="title" className={css.error} /> 
  </div>

  <div className={css.formGroup}>
    <label htmlFor={`${formId}-content`}>Content</label>
    <Field as="textarea"
      id={`${formId}-content`}
      name="content"
      rows={8}
      className={css.textarea}
    />
    <ErrorMessage component="span" name="content" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor={`${formId}-tag`}>Tag</label>
    <Field as="select" id={`${formId}-tag`} name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage component="span" name="tag" className={css.error} />
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
    <button
      type="submit"
      className={css.submitButton}
      disabled={false}
    >
      Create note
    </button>
  </div>
            </Form>
        </Formik>

    )
 }