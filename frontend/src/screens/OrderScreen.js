import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
	deliverOrder,
} from '../actions/orderActions'

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = src;
		script.onload = () => {
			resolve(true);
		};
		script.onerror = () => {
			resolve(false);
		};
		document.body.appendChild(script);
	});
}

const OrderScreen = ({ match }) => {
	const orderId = match.params.id

	const dispatch = useDispatch()

	const [loading, setLoading] = useState(true);
	const [order, setOrder] = useState(null);

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	useEffect(() => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		axios.get(`/api/orders/${orderId}`, config)
		.then(({data}) => {
			console.log('data', data)
			setLoading(false);
			setOrder(data);
		})
		.catch(err => {
			setLoading(false);
			console.log('error getting order', err);
		})
		
	}, []) // Dependencies, on change they fire off useEffect

	async function displayRazorpay(order) {
		const res = await loadScript(
			"https://checkout.razorpay.com/v1/checkout.js"
		);
	
		if (!res) {
			alert("Razorpay SDK failed to load. Are you online?");
			return;
		}
		const userInfo = JSON.parse(localStorage.userInfo);
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}
	
		const { totalPrice: amount, _id: order_id, } = order;
		const currency = 'INR';
	
		const options = {
			key: "rzp_test_dk4BPSwoZtpWAj", // Enter the Key ID generated from the Dashboard
			amount: (parseInt(amount * 100)).toString(),
			currency: currency,
			name: "Fuldozzer",
			description: "Pay",
			// order_id: order_id,
			handler: async function (response) {
				const data = {
					orderCreationId: order_id,
					razorpayPaymentId: response.razorpay_payment_id,
					razorpayOrderId: response.razorpay_order_id,
					razorpaySignature: response.razorpay_signature,
				};
	
				const {data: updated_order} = await axios.put(`/api/orders/${order_id}/pay`, data, config);
				setOrder(updated_order);
			},
			prefill: {
				name: userInfo.name,
				email: userInfo.email,
				contact: "9999999999",
			},
			notes: {
				address: "Soumya Dey Corporate Office",
			},
			theme: {
				color: "#61dafb",
			},
		};
	
		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	}
	

	const deliverHandler = () => {
		dispatch(deliverOrder(order))
	}

	return loading ? (
		<Loader />
	) : ( order &&
		<>
			<Link
				// TODO if admin has an order go back to /profile
				to={userInfo.isAdmin ? '/admin/orderlist' : '/profile'}
				className='btn btn-light my-3'
			>
				Go Back
			</Link>
			<h1>Order {order._id}</h1>
			<Row>
				{/* Left Steps Summary */}
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>

							<p>
								<span className='push-to-right'>
									<strong>Name: </strong> {order.user.name}
								</span>
							</p>

							<p>
								<span className='push-to-right'>
									<strong>Email: </strong>
									<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
								</span>
							</p>

							<p>
								<span className='push-to-right'>
									<strong>Address: </strong>
									{order.shippingAddress.address}, {order.shippingAddress.city}{' '}
									{order.shippingAddress.postalCode},{' '}
									{order.shippingAddress.country}
								</span>
							</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Delivered on {order.deliveredAt}
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<span className='push-to-right'>
									<strong>Method: </strong>
									{order.paymentMethod}
								</span>
							</p>
							{order.isPaid ? (
								<Message variant='success'>Paid on {order.paidAt}</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Your order is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x Rs{item.price} = Rs{item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				{/* Right Order Summary */}
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>Items</Col>
									<Col>Rs{order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>Shipping</Col>
									<Col>Rs{order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>Tax</Col>
									<Col>Rs{order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>
										<strong>Total</strong>
									</Col>
									<Col>
										<strong>Rs{order.totalPrice}</strong>
									</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									<Button
									type='button'
									className='btn-block'
									onClick={() => displayRazorpay(order)}
									>
										Pay
									</Button>
								</ListGroup.Item>
							)}
							{userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<Button
										type='button'
										className='btn btn-block'
										onClick={deliverHandler}
									>
										Mark As Delivered
									</Button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen
