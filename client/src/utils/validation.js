const MIN_PASSWORD_LENGTH = 4;

export function validatePassword(password, confirmPassword) {
	if(password !== confirmPassword) return false;
	console.log(password.length)
	if(password.length > MIN_PASSWORD_LENGTH) return true;
	else return false;

}