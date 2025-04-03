import React, { useState, useEffect, useCallback } from 'react';
import { Card, Col, Container, Row, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const ApplicationsList = ({ applicationList, handleCardClick, selectedApplication, handleUpdateDetails, handleDeleteApplication }) => {
  const [closeModal, setCloseModal] = useState(true);
  const [job, setJob] = useState();
  const [company, setCompany] = useState();
  const [location, setLocation] = useState();
  const [status, setStatus] = useState();
  const [date, setDate] = useState();
  const [interviewDate, setInterviewDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [jobLink, setJobLink] = useState();
  const [isCreate, setIsCreate] = useState();

  const findStatus = (value) => {
    let status = '';
    if (value === '1') status = '💡 Wish List';
    else if (value === '2') status = '👤 Waiting for referral';
    else if (value === '3') status = '✅ Applied';
    else if (value === '4') status = '❌ Rejected';
    else if (value === '5') status = '🎤 Interviewing';
    return status || "N/A";
  };

  return (
    <>
      <Button
        style={{
          marginLeft: "1rem",
          marginTop: "4%",
          backgroundColor: "#296E85",
          borderRadius: "8px",
          border: "none",
        }}
        size="lg"
        onClick={() => {
          handleCardClick(null);
          setCloseModal(false);
          setIsCreate(true);
          setJob(null);
          setCompany(null);
          setLocation(null);
          setStatus(null);
          setDate(null);
          setInterviewDate(null);
          setStartTime(null);
          setEndTime(null);
          setJobLink(null);
        }}
      >
        + Add New Application
      </Button>

      <Container style={{ marginTop: "30px" }}>
        <Row>
          {applicationList.map((jobListing) => (
            <Col key={jobListing.id} md={12} style={{ marginBottom: "20px" }}>
              <Card
                style={{
                  borderColor: "#e0e0e0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "0.3s",
                  cursor: "pointer",
                  padding: "15px",
                }}
                onClick={() => {
                  handleCardClick(jobListing);
                  setCloseModal(false);
                  setJob(jobListing?.title);
                  setCompany(jobListing?.company);
                  setLocation(jobListing?.location);
                  setStatus(jobListing?.status);
                  setDate(jobListing?.date);
                  setInterviewDate(jobListing?.interviewDate);
                  setStartTime(jobListing?.startTime);
                  setEndTime(jobListing?.endTime);
                  setJobLink(jobListing?.link);
                  setIsCreate(false);
                }}
              >
                <Card.Body>
                <Row className="align-items-center justify-content-between" style={{ marginTop: "10px" }}>
                {/* Column 1: Location, Date, and Status */}
                <Col sm={6}>
                  {/* Location */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span role="img" aria-label="location">📍</span>
                    <strong style={{ marginLeft: "5px" }}>Location:</strong>
                    <span style={{ marginLeft: "5px" }}>{jobListing?.location || "N/A"}</span>
                  </div>

                  {/* Date */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "10px",
                    }}
                  >
                    <span role="img" aria-label="calendar">📅</span>
                    <strong style={{ marginLeft: "5px" }}>Date:</strong>
                    <span style={{ marginLeft: "5px" }}>{jobListing?.date || "N/A"}</span>
                  </div>

                  {/* Status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "10px",
                    }}
                  >
                    <span role="img" aria-label="status">📊</span>
                    <strong style={{ marginLeft: "5px" }}>Status:</strong>
                    <span style={{ marginLeft: "5px" }}>{findStatus(jobListing?.status) || "N/A"}</span>
                  </div>
                </Col>

                {/* Column 2: Interview Date, Start Time, and End Time */}
                <Col sm={6}>
                  {/* Interview Date */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span role="img" aria-label="interview">🎤</span>
                    <strong style={{ marginLeft: "5px" }}>Interview Date:</strong>
                    <span style={{ marginLeft: "5px" }}>{jobListing?.interviewDate || "N/A"}</span>
                  </div>

                  {/* Start Time */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "10px",
                    }}
                  >
                    <span role="img" aria-label="clock">⏰</span>
                    <strong style={{ marginLeft: "5px" }}>Start Time:</strong>
                    <span style={{ marginLeft: "5px" }}>{jobListing?.startTime || "N/A"}</span>
                  </div>

                  {/* End Time */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "10px",
                    }}
                  >
                    <span role="img" aria-label="clock">⏰</span>
                    <strong style={{ marginLeft: "5px" }}>End Time:</strong>
                    <span style={{ marginLeft: "5px" }}>{jobListing?.endTime || "N/A"}</span>
                  </div>
                </Col>
              </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container >

      <Modal show={!closeModal} onHide={() => setCloseModal(true)}>
        <Modal.Header closeButton>
          <Modal.Title>{isCreate ? 'Add New Application' : 'Update Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-2">
            <label className='col-form-label'>Job Title</label>
            <input type="text" className="form-control" placeholder="Job Title" value={job} onChange={(e) => setJob(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className='col-form-label'>Company Name</label>
            <input type="text" className="form-control" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className='form-group mb-2'>
            <label className='col-form-label'>Date</label>
            <input type='date' className='form-control' value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className='form-group mb-2'>
            <label className='col-form-label'>Job Link</label>
            <input type='text' className='form-control' placeholder='Job Link' value={jobLink} onChange={(e) => setJobLink(e.target.value)} />
          </div>
          <div className='form-group mb-3'>
            <label className='col-form-label pb-1'>Location</label>
            <input type='text' className='form-control' placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <label className='input-group-text'>Application Type</label>
            </div>
            <select className='form-control' value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Choose...</option>
              <option value='1'>Wish list</option>
              <option value='2'>Waiting Referral</option>
              <option value='3'>Applied</option>
              <option value='4'>Rejected</option>
              <option value='5'>Interviewing</option>
            </select>
          </div>
          {status === '5' && ( // Conditionally render the interview date field
            <>
              {/* Interview Date */}
              <div className='form-group mb-3'>
                <label className='col-form-label'>Interview Date</label>
                <input
                  type='date'
                  className='form-control'
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
          
              {/* Start Time */}
              <div className='form-group mb-3'>
                <label className='col-form-label'>Start Time</label>
                <input
                  type='time'
                  className='form-control'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
          
              {/* End Time */}
              <div className='form-group mb-3'>
                <label className='col-form-label'>End Time</label>
                <input
                  type='time'
                  className='form-control'
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!isCreate && (
            <Button
              variant="danger"
              onClick={() => {
                handleDeleteApplication(selectedApplication);
                setCloseModal(true);
              }}
            >
              Delete
            </Button>
          )}
          {status === '5' && interviewDate && startTime && endTime && (
            <Button
              variant="primary"
              onClick={() => {
                const eventTitle = encodeURIComponent(`${job + "Interview" || 'Interview'} at ${company || 'N/A'}`); // Include job title and company name
                const eventLocation = encodeURIComponent(location || '');
                const eventDetails = encodeURIComponent(`Interview with ${company || 'N/A'}`);
                const startDateTime = new Date(`${interviewDate}T${startTime}`).toISOString().replace(/-|:|\.\d+/g, ''); // Format: YYYYMMDDTHHMMSSZ
                const endDateTime = new Date(`${interviewDate}T${endTime}`).toISOString().replace(/-|:|\.\d+/g, ''); // Format: YYYYMMDDTHHMMSSZ
            
                const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDateTime}/${endDateTime}&details=${eventDetails}&location=${eventLocation}`;
                window.open(googleCalendarUrl, '_blank');
              }}
            >
              Export to Google Calendar
            </Button>
          )}
          <Button
            variant="success"
            onClick={() => {
              handleUpdateDetails(
                selectedApplication?.id,
                job,
                company,
                location,
                date,
                status,
                jobLink,
                interviewDate,
                startTime,
                endTime
              );
              setCloseModal(true);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const ApplicationPage = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isChanged, setISChanged] = useState(true);

  useEffect(() => {
    if (isChanged) {
      fetch('http://127.0.0.1:5000/applications', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
          'Access-Control-Allow-Credentials': 'true',
        },
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setApplicationList(data);
          setISChanged(false); // Reset the flag after fetching
        })
        .catch(() => alert('Error while fetching applications!'));
    }
  }, [isChanged]);

  const handleCardClick = (jobListing) => setSelectedApplication(jobListing);

  const handleUpdateDetails = useCallback((id, job, company, location, date, status, jobLink, interviewDate, startTime, endTime) => {
    let application = { id: id || null, title: job, company: company, location, date, status, jobLink };
  
    if (status === '5') {
      application.interviewDate = interviewDate;
      application.startTime = startTime;
      application.endTime = endTime;
    } else {
      application.interviewDate = null;
      application.startTime = null;
      application.endTime = null;
    }
  
    const url = id ? `http://127.0.0.1:5000/applications/${id}` : 'http://127.0.0.1:5000/applications';
    const method = id ? 'PUT' : 'POST';
  
    fetch(url, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
      method,
      body: JSON.stringify({ application }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!id) application.id = data.id;
        setApplicationList((prev) =>
          id ? prev.map((app) => (app.id === id ? application : app)) : [...prev, application]
        );
      })
      .catch((error) => alert(id ? 'Update Failed!' : 'Adding application failed!'));
  }, []);

  const handleDeleteApplication = (application) => {
    console.log('Deleting application with ID:', application?.id); // Debugging log
    fetch(`http://127.0.0.1:5000/applications/${application?.id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setApplicationList((prev) => prev.filter((app) => app.id !== application.id));
          setSelectedApplication(null);
          setISChanged(true);
        } else {
          throw new Error('Failed to delete application');
        }
      })
      .catch((error) => {
        console.error('Error while deleting application:', error); // Log the error for debugging
        alert('Error while deleting the application!');
      });
  };

  return <ApplicationsList
    applicationList={applicationList}
    handleCardClick={handleCardClick}
    selectedApplication={selectedApplication}
    handleUpdateDetails={handleUpdateDetails}
    handleDeleteApplication={handleDeleteApplication}
  />;
};

export default ApplicationPage;
