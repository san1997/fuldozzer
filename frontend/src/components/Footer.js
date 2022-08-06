import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
	return (
		<footer>
			<Container>
				<Row>
					<Col className='text-center py-3'>
						<a
							rel='noopener noreferrer'
							href='http://fuldose.com/about-us'
							target='_blank'
							className='melvin-kisten'
						>
							<i className='fas fa-user-circle'></i> Fuldose.com
						</a>
						
						<i className='fa fa-phone' style={{marginLeft: '1em'}}></i>8950253211, 7417204257
						<i className='fa fa-at' style={{marginLeft: '1em'}}></i>fuldozzer@gmail.com
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
