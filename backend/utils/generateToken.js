import jwt from 'jsonwebtoken'

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const generateResetToken = (id) => {
	return jwt.sign({ id }, process.env.RESET_PASSWORD_KEY, { expiresIn: "20m" });
}

const verifyResetToken = (resetLink, callback) => {
	return jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY);
}

export {
	generateToken,
	generateResetToken,
	verifyResetToken
}
