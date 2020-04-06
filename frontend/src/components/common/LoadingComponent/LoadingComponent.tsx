import React, { ReactNode } from "react";
import { CircularProgress } from "@material-ui/core";

type Props = {
	loading: boolean;
	children: ReactNode;
};

export const LoadingComponent: React.FC<Props> = props => (
	props.loading ? (
		<div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
			<CircularProgress />
		</div>
	)
		: (
			<>{props.children}</>
		)
);

