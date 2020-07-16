import React, { Dispatch, SetStateAction } from 'react';
import { createToken } from '../../../api/api';
import SelectField from '../../common/form/SelectField/SelectField';
import { Form, Field, Formik } from 'formik';
import { FormikTextField, FormikMultiLineTextField } from '../../common/form/FormikTextField/FormikTextField';
import { range } from '../../../utils/utils';
import { Typography } from '@material-ui/core';
import Button from '../../common/Button/Button';

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

export default ({ setTokens, setLoading }: { setTokens: setState<string[]>, setLoading: setState<boolean> }) => {

    const handleTokenCreation = async (content: string, ttl: number, linksNumber: number) => {
        setTokens([]);
        setLoading(true);
        createToken(content, ttl, linksNumber)
            .then(setTokens)
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Typography variant="h3">
                Share Secret Data
            </Typography>
            <Formik
                initialValues={initialValues}
                onSubmit={async values => {
                    values.ttl !== undefined && handleTokenCreation(values.content, +values.ttl, +values.linksNumber);
                }}
                render={() =>
                    <Form>
                        <Field label="Content" name="content" placeholder="Enter your content here" component={FormikMultiLineTextField} />
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
                        <Button type="submit">
                            Share Secret
                        </Button>
                    </Form>
                } />
        </>
    )
};