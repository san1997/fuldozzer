import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import Swal from 'sweetalert2'

const ResetPasswordScreen = ({ location, history, match }) => {
	const [password, setPassword] = useState('');
	const [rePassword, setRePassword] = useState('');
	const [loading, setLoading] = useState(false);
	const token = match.params.token;

	const submitHandler = (e) => {
		e.preventDefault()
		// Dispatch login
		if (password !== rePassword) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Both the passwords dont match.',
			})
		}

		setLoading(true);
		axios.put(`/api/users/reset-password`, {
			newPass: password,
			resetLink: token
		})
		.then(res => {
			setLoading(false);
			history.push('/login');
			console.log('password reset');
		})
		.catch(err => {
			setLoading(false);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: err.name,
			})
			console.log('error in reset', err);
		})
	}

	return (
		<FormContainer>
			<h1>Reset Password</h1>
			{loading && <Loader />}
			<Form onSubmit={submitHandler}>
				{/* Password */}
				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				{/* Re - Password */}
				<Form.Group controlId='password'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={rePassword}
						onChange={(e) => setRePassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				{/* Button */}
				<Button type='submit' variant='primary'>
					Reset
				</Button>
			</Form>
		</FormContainer>
	)
}

export default ResetPasswordScreen
