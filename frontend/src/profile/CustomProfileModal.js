import axios from 'axios';
import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, Form } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { CONSTANTS } from '../data/Constants';
import Select from 'react-select';
import universityOptions from '../data/universityOptions';


const CustomProfileModal = (props) => {
	const { profile, setProfile, setModalOpen, updateProfile } = props;
	const [data, setData] = useState(profile);
	const [error, setError] = useState(false);

	const handleSave = () => {
		const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneNumberRegex = /^[0-9]{10}$/;

		if (data[CONSTANTS.PROFILE.NAME] == '') {
			setError(true);
		} else if (!emailFormatRegex.test(data[CONSTANTS.PROFILE.EMAIL]))	{
			setError(true);
			alert('Please enter a valid email address.');
		} else if (!phoneNumberRegex.test(data[CONSTANTS.PROFILE.CONTACT])) {
			setError(true);
			alert('Please enter a valid 10-digit phone number with no spaces.');
		} else {
			axios
				.post(
					'http://localhost:5000/updateProfile',
					{
						...data
					},
					{
						headers: {
							userid: profile.id,
							Authorization: `Bearer ${localStorage.getItem('userId')}`
						}
					}
				)
				.then((res) => {
					// setProfile({ ...profile, ...data });
					updateProfile({ ...profile, ...data });
					console.log(data);
					setModalOpen(false);
				})
				.catch((err) => {
					console.log(err.message);
					setModalOpen(false);
				});
		}
	};

	return (
		<Modal show={true} centered>
			<ModalHeader>
				<h5 className='modal-title'>Edit Details</h5>
				<button
					type='button'
					className='btn-close'
					aria-label='Close'
					onClick={() => setModalOpen(false)}
				></button>
			</ModalHeader>
			<ModalBody>
				<Form>
					<Form.Group className='mb-3'>
						<Form.Label>
							Name<span style={{ color: 'red' }}>*</span>
						</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter name'
							value={data[CONSTANTS.PROFILE.NAME]}
							onChange={(e) =>
								setData({ ...data, [CONSTANTS.PROFILE.NAME]: e.target.value })
							}
						/>
						{error && (
							<span style={{ color: 'red', fontSize: 12 }}>
								This field is required
							</span>
						)}
					</Form.Group>
					<Form.Group className='my-3'>
						<Form.Label>University</Form.Label>
						<Select
							options={universityOptions}
							placeholder="Select or type a university"
							value={universityOptions.find(
								(option) => option.value === data[CONSTANTS.PROFILE.UNIVERSITY]
							)} // Set the current value
							onChange={(selectedOption) =>
								setData({
									...data,
									[CONSTANTS.PROFILE.UNIVERSITY]: selectedOption ? selectedOption.value : ''
								})
							}
							isClearable
						/>
					</Form.Group>
					<Form.Group className='my-3'>
						<Form.Label>Email</Form.Label>
						<Form.Control
							type='email'
							placeholder='Enter email'
							value={data[CONSTANTS.PROFILE.EMAIL]}
							onChange={(e) =>
								setData({ ...data, [CONSTANTS.PROFILE.EMAIL]: e.target.value })
							}
						/>
					</Form.Group>
					<Form.Group className='my-3'>
						<Form.Label>Address</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter address'
							value={data[CONSTANTS.PROFILE.ADDRESS]}
							onChange={(e) =>
								setData({
									...data,
									[CONSTANTS.PROFILE.ADDRESS]: e.target.value
								})
							}
						/>
					</Form.Group>
					<Form.Group className='my-3'>
						<Form.Label>Contact</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter contact'
							value={data[CONSTANTS.PROFILE.CONTACT]}
							onChange={(e) =>
								setData({
									...data,
									[CONSTANTS.PROFILE.CONTACT]: e.target.value
								})
							}
						/>
					</Form.Group>
				</Form>
			</ModalBody>
			<ModalFooter>
				<button type='button' className='btn btn-primary' onClick={handleSave}>
					Save
				</button>
			</ModalFooter>
		</Modal>
	);
};

export default CustomProfileModal;
