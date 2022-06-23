import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import './SearchBox.css';

const SearchBox = ({ history }) => {
	const [keyword, setKeyword] = useState('')

	const submitHandler = (e) => {
		e.preventDefault()
		if (keyword.trim()) {
			history.push(`/search/${keyword}`)
		} else {
			history.push('/')
		}
	}
	return (
		<Form onSubmit={submitHandler} className="search-bar" inline>
			<Form.Control
				type='text'
				name='q'
				onChange={(e) => setKeyword(e.target.value)}
				placeholder='Search Products...'
				className='input-bar'
			></Form.Control>
			<Button type='submit' className='btn btn-secondary p-2'>
				Search
			</Button>
		</Form>
	)
}

export default SearchBox
