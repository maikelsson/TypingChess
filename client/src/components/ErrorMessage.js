import React from 'react';
import { Alert } from '@material-ui/lab';

export const ErrorMessage = () => {
	return (
		<Alert open={false} severity="error">
			Error happened!
		</Alert>
	)
}
