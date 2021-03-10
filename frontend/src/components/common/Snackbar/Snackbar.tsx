import { Slide } from "@material-ui/core";
import Icon from '@material-ui/core/Icon';
import IconButton from "@material-ui/core/IconButton/IconButton";
import MaterialUISnackbar from "@material-ui/core/Snackbar/Snackbar";
import { TransitionProps } from "@material-ui/core/transitions";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { useRecoilState } from 'recoil';
import { clearSnackbar, snackBarState } from "./atoms";


const SlideTransition = (props: TransitionProps) => <Slide {...props} direction="down" />;

const useStyles = makeStyles({
	error: {
		background: "#c10d12",
	},
	warning: {
		background: "#c17400",
	},
	information: {
		background: "#0054c1",
	},
	check: {
		background: "#008c19",
	},
	message: {
		display: "flex",
		alignItems: "center",
		'white-space': 'pre-wrap',
	},
});

const AUTO_HIDE_DURATION = 2000; // ms

const Snackbar = () => {

	const [stayOpen, setStayOpen] = useState(true);
	const [snackbar, setSnackBar] = useRecoilState(snackBarState);

	const handleExited = () => {
		setStayOpen(true);
		clearSnackbar(setSnackBar);
	};

	const classes = useStyles();

	return (
		<MaterialUISnackbar
			anchorOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
			open={!!snackbar && stayOpen}
			autoHideDuration={AUTO_HIDE_DURATION}
			onClose={() => setStayOpen(false)}
			onExited={handleExited}
			TransitionComponent={SlideTransition}
			ContentProps={{
				classes: {
					root: snackbar ? classes[snackbar!.type] : "",
				},
				"aria-describedby": "message-id",
			}}
			message={
				snackbar && (
					<span id="client-snackbar" className={classes.message}>
						<Icon style={{ marginRight: "10px" }}>
							{snackbar.type}
						</Icon>
						{snackbar.message}
					</span>
				)
			}
			action={[
				<IconButton key="close" aria-label="Close" color="inherit" onClick={() => setStayOpen(false)}>
					<CloseIcon />
				</IconButton>,
			]}
		/>
	);
};

export default Snackbar;
