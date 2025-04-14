import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, Form } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import $ from 'jquery'

const CoverLetter = (props) => {
    const { setState } = props;
    const [jobDescription, setJobDescription] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if(!coverLetter){
            alert("No cover letter generated to save.");
            return;
        }
        try {
            $.ajax({
                url: 'http://127.0.0.1:5000/save_cover_letter',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    cover_letter: coverLetter,
                    resume_idx: props.idx
                }),
                dataType: 'json',
                success: (message, textStatus, response) => {
                    alert("Cover letter saved successfully!");
                    // Optionally close the modal
                    setState(null);
                },
                error: (xhr, status, error) => {
                    console.error("Error saving cover letter:", error);
                    alert("Failed to save cover letter. Please try again.");
                }
            });
        } catch (error) {
            console.error("Error during download:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    const handleGenerateCoverLetter = async () => {
        setIsLoading(true);
        try {
            $.ajax({
                url: 'http://127.0.0.1:5000/cover_letter/' + props.idx,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
                    'Access-Control-Allow-Credentials': 'true',
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ "job_description": jobDescription }),
                dataType: 'json',
                success: (message, textStatus, response) => {
                    setCoverLetter(response.responseJSON.response)
                }
            })
        } catch (error) {
            console.error('Error generating cover letter:', error);
            alert('Failed to generate cover letter. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <Modal centered show={true} scrollable size='xl'>
            <ModalHeader style={{ backgroundColor: '#296E85', color: '#fff' }}>
                <h4 className='mb-0 p-2'>AI-Generated Cover Letter</h4>
            </ModalHeader>
            <ModalBody className='p-4'>
                <Form.Group className="mb-3">
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Enter the job description here..."
                    />
                </Form.Group>
                <Button
                    className='custom-btn px-3 py-2 mb-3'
                    onClick={handleGenerateCoverLetter}
                    disabled={isLoading || !jobDescription.trim()}
                >
                    {isLoading ? 'Generating...' : 'Generate Cover Letter'}
                </Button>
                {coverLetter && (
                    <div className='mt-4'>
                        {/* <div style={{ fontSize: 22, fontWeight: '500' }}>Generated Cover Letter<br/><br/></div> */}
                        <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: 12 }}>{coverLetter}</p>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button className='btn-success px-3 py-2' onClick={() => handleDownload()}> ↓ Download</Button>
                <Button className='btn-danger px-3 py-2' onClick={() => setState(null)}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CoverLetter;
