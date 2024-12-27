export const removeParentheses = (nickname: string) => {
	return nickname.replace(/\(.*\)/, '').trim();
};
