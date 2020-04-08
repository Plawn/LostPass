import React, { useState, useMemo } from 'react';
import { Typography, IconButton } from '@material-ui/core';
import { LoadingComponent } from '../common/LoadingComponent/LoadingComponent';
import { createToken } from '../../api/api';
import SelectField from '../common/form/SelectField/SelectField';
import { Form, Field, Formik } from 'formik';
import { FormikTextField, FormikMultiLineTextField } from '../common/form/FormikTextField/FormikTextField';
import { range } from '../../utils/utils';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Button from '../common/Button/Button';
import TextField from '../common/form/TextField/TextField';
import CopyToClipboard from 'react-copy-to-clipboard';

const durationOptions = [
    { label: 'Hour', value: 3600 },
    { label: 'Day', value: 3600 * 24 },
    { label: 'Week', value: 3600 * 24 * 7 },
    { label: 'Never', value: 0 },
]

const linksNumberOptions = range(10, 1).map(i => ({ label: `${i}`, value: i }));

const makeViewLink = (token: string) => document.location.origin + `/view/${encodeURI(token)}`;

const TokenComponent = ({ url }: { url: string }) => {

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(url);
        // snackbar maybe
    };

    return (
        <div style={{ display: 'flex' }}>
            <TextField value={url}
                style={{ width: '100%' }}
                InputProps={{ readOnly: true }}
            />
            <CopyToClipboard text={url}>
                <IconButton component="span">
                    <FileCopyOutlinedIcon />
                </IconButton>
            </CopyToClipboard>
        </div>
    )
}
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

const TokenForm = ({ setTokens, setLoading }: { setTokens: any, setLoading: any }) => {

    const handleTokenCreation = async (content: string, ttl: number, linksNumber: number) => {
        setTokens([]);
        setLoading(true);
        try {
            const tokens = await createToken(content, ttl, linksNumber);
            setTokens(tokens);
        } catch (e) {

        }
        setLoading(false);
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
                render={(values) =>
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
}



const NewToken = () => {


    const [tokens, setTokens] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // doing so to add all copy on one click after
    const urls = useMemo(() => tokens.map(makeViewLink), [tokens]);

    return (
        <LoadingComponent loading={loading}>
            {tokens.length > 0 ?
                <>
                    {urls.map(url => <TokenComponent url={url} />)}
                    <br />
                    <Button onClick={() => setTokens([])}>
                        Share again
                        </Button>
                </>
                :
                <TokenForm setLoading={setLoading} setTokens={setTokens} />
            }
        </LoadingComponent>
    )
}

export default NewToken;