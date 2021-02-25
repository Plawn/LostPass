import React, { Dispatch, memo, SetStateAction, useState } from 'react';
import { createTokenForFile, createTokenForString } from '../../../api/api';
import SelectField from '../../common/form/SelectField/SelectField';
import { Form, Field, Formik } from 'formik';
import { FormikTextField, FormikMultiLineTextField } from '../../common/form/FormikTextField/FormikTextField';
import { range } from '../../../utils/utils';
import { Button, Typography } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';

type setState<T> = Dispatch<SetStateAction<T>>;

const durationOptions = [
    { label: 'Hour', value: 3600 },
    { label: 'Day', value: 3600 * 24 },
    { label: 'Week', value: 3600 * 24 * 7 },
    { label: 'Never', value: 0 },
];

const linksNumberOptions = range(10, 1).map(i => ({ label: `${i}`, value: i }));

type Values = {
    ttl?: number;
    content: string;
    linksNumber: number;
}

const initialValues: Values = {
    ttl: durationOptions[0].value,
    content: '',
    linksNumber: 1,
};

type Props = {
    setTokens: setState<string[]>;
    setLoading: setState<boolean>;
};

const TokenForm = memo(({ setTokens, setLoading }: Props) => {

    const [usingFile, setUsingFile] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File>();
    const handleTokenCreationForString = async (content: string, ttl: number, linksNumber: number) => {
        setTokens([]);
        setLoading(true);
        createTokenForString(content, ttl, linksNumber)
            .then(setTokens)
            .catch((e) => {
                console.error('Failed to make token');
            })
            .finally(() => setLoading(false));
    };

    const handleTokenCreationForFile = async (content: File, ttl: number, linksNumber: number) => {
        setTokens([]);
        setLoading(true);
        createTokenForFile(content, ttl, linksNumber)
            .then(setTokens)
            .catch((e) => {
                console.error('Failed to make token');
            })
            .finally(() => setLoading(false));
    };

    const handleFile = (files: File[]) => {
        if (files.length > 0) {
            setSelectedFile(files[0]);
        }
    }

    return (
        <>
            <Typography variant="h3">
                Share Secret Data
            </Typography>
            <Formik
                initialValues={initialValues}
                onSubmit={async values => {
                    if (values.ttl !== undefined) {
                        if (usingFile && selectedFile) {
                            handleTokenCreationForFile(selectedFile, +values.ttl, +values.linksNumber);
                        } else {
                            handleTokenCreationForString(values.content, +values.ttl, +values.linksNumber);
                        }
                    }
                }}
            >
                {() =>
                    <Form>
                        {usingFile ? (<>
                            <DropzoneArea
                                onChange={handleFile}
                                clearOnUnmount
                                filesLimit={1}
                            />
                        </>) : (
                                <Field label="Content" name="content" placeholder="Enter your content here" component={FormikMultiLineTextField} />
                            )}
                        <div>
                            <Typography variant="h6">
                                TTL
                            </Typography>
                            <Field name="ttl" placeholder="Duration in seconds" component={FormikTextField} />
                            <Field name="ttl" options={durationOptions} label="ttl" component={SelectField} initialValue={durationOptions[0].label} />
                        </div>
                        <div>
                            <Typography variant="h6">
                                Number of links
                            </Typography>
                            <Field name="linksNumber" placeholder="Number of links" component={FormikTextField} />
                            <Field name="linksNumber" options={linksNumberOptions} label="Number of links" component={SelectField} />
                        </div>
                        <br />
                        <Button color="primary" variant="contained" type="submit">
                            Share Secret
                        </Button>
                    </Form>
                }</Formik>
        </>
    )
});

export default TokenForm;