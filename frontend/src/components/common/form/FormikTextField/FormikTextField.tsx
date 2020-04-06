import React from 'react';
import { FieldProps } from 'formik';
import TextField  from '../TextField/TextField';
import MultiLineTextField from '../MultiLineTextField/MultiLineTextField';

export const FormikTextField: React.FC<FieldProps> = (props) => <TextField {...props.field} {...props} />;

export const FormikMultiLineTextField: React.FC<FieldProps> = (props) => <MultiLineTextField {...props.field} {...props} />;