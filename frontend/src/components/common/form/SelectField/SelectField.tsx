import React, { ChangeEvent, useState, useMemo } from "react";
import { FormControl, Theme } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { FormikProps } from "formik";
import { makeStyles } from "@material-ui/styles";
import { useUID } from 'react-uid';

type Props<T> = {
	options: { label: string; value: T }[];
	form?: FormikProps<T>;
	field?: { name: string; value: T };
	name?: string;
	label?: string;
	style?: any;
	onChange?: (event: ChangeEvent<{ label?: string; value: { value: T; label: string } }>) => void;
	initialValue?: { label: string; value: T };
};

const useStyles = makeStyles((theme: Theme) => ({
	icon: {
		color: theme.palette.primary.main,
	},
	root: {
		color: theme.palette.primary.main,
		display: "flex",
		flexWrap: "wrap",
		"& $notchedOutline": {
			borderColor: theme.palette.primary.main,
		},
		"&:hover $notchedOutline": {
			borderColor: theme.palette.primary.main,
		},
		"&$focused $notchedOutline": {
			borderColor: theme.palette.primary.main,
		},
	},
	menuItem: {
		"&:hover": {
			backgroundColor: theme.palette.primary.main + "8C",
		},
	},
	formControl: {
		margin: theme.spacing(1),
		width: 200,
	},
	inputLabel: {
		color: theme.palette.primary.main,
	},
}));


/**
 * /!\ Warning this component may break with formik updates
 */
const SelectField = <T extends {}>(props: Props<T>) => {
	const { options } = props;
	const [value, setValue] = useState(props.initialValue || "");

	const renderedOptions = useMemo(() => options.map(e => ({ label: e.label, value: e })), [options]);

	const handleChange = (event: ChangeEvent<{ label?: string; value: { label: string; value: T } }>) => {
		setValue(event.target.value.label || "");
		props.form && props.form.setFieldValue(props.field!.name, event.target.value.value, true);
		props.onChange && props.onChange(event);
	};
	const classes = useStyles();
	const uid = useUID();
	return (
		<FormControl variant="outlined" margin="dense" className={classes.formControl} style={props.style}>
			<InputLabel classes={{ root: classes.inputLabel }} htmlFor={uid}>
				{props.label}
			</InputLabel>
			<Select
				id={uid}
				onChange={e => handleChange(e as ChangeEvent<{ label?: string; value: { value: T; label: string } }>)}
				value={value}
				classes={{ icon: classes.icon }}
				renderValue={(value: any) => <>{value.label || value}</>}
				label={props.label}
			>
				{renderedOptions.map((option: any) => (
					<MenuItem value={option.value} className={classes.menuItem} key={option.label}>
						{option.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default SelectField;
