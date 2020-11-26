export function validatePassword(pw, confirmPw) {
	if(pw !== confirmPw) return false;
	console.log(pw.length)
	if(pw.length > 5) return true;
	else return false;

}