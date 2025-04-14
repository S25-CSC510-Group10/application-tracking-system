import React, { Component } from 'react';
import $ from 'jquery';
import '../static/resume.css';
import CoverLetter from '../Modals/CoverLetter';
import { Button } from 'react-bootstrap';

export default class ManageCoverLettersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileNames: [],
      loading: false,
      coverLetterIdx: null,
    };
  }

  // Fetches cover letter file names from the server.
  getFiles = () => {
    $.ajax({
      url: 'http://127.0.0.1:5000/cover_letters',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
        'Access-Control-Allow-Credentials': 'true'
      },
      credentials: 'include',
      success: (message, textStatus, response) => {
        console.log("Fetched cover letters:", message);
        // Ensure that message.filenames is at least an empty array.
        this.setState({
          fileNames: message.filenames || [],
        });
      },
      error: (xhr, status, error) => {
        console.error("Error fetching cover letters:", error);
      }
    });
  };

  previewCoverLetter(idx) {
    $.ajax({
      url: 'http://127.0.0.1:5000/cover_letters/' + idx,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
        'Access-Control-Allow-Credentials': 'true'
      },
      xhrFields: { responseType: 'blob' },
      credentials: 'include',
      success: (message, textStatus, response) => {
        console.log(message)
        if (message) {
          window.open(URL.createObjectURL(message), '_blank');
        }
      }
    })
  }

  // Opens the modal to preview a cover letter.
  openCoverLetterModal = (idx) => {
    this.setState({ coverLetterIdx: idx });
  };

  // Closes the cover letter modal.
  closeCoverLetterModal = () => {
    this.setState({ coverLetterIdx: null });
  };

  // Deletes a cover letter by its index.
  deleteCoverLetter = (idx) => {
    $.ajax({
      url: `http://127.0.0.1:5000/cover_letters/${idx}`,
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      success: () => {
        this.getFiles();
      },
    });
  };

  // Handles uploading a new cover letter.
  uploadCoverLetter = (e) => {
    e.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";

    fileInput.addEventListener("change", (event) => {
      if (event.target.files.length === 0) return;

      this.setState({ loading: true });
      let formData = new FormData()
      const file = event.target.files[0];
      formData.append('file', file);

      $.ajax({
        url: 'http://127.0.0.1:5000/cover_letters',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        success: (msg) => {
          console.log("Upload successful:", msg)
          this.setState({ fileNames: [...this.state.fileNames, msg.filename] })
        }
      }).always(() => this.setState({ loading: false }));
    });
    fileInput.click();
  };

  // Lifecycle method: fetch files when the component mounts.
  componentDidMount() {
    this.getFiles();
  }

  componentWillUnmount() {
    if (this.state.previewUrl) {
      URL.revokeObjectURL(this.state.previewUrl);
    }
  }

  render() {
    return (
      <div className="pagelayout">
        <button
          id="upload-file-btn"
          onClick={this.uploadCoverLetter}
          disabled={this.state.loading}
          style={{
            display: 'block',
            margin: '0 auto'
          }}
        >
          {this.state.loading ? 'Uploading...' : 'Upload New'}
        </button>
        <div style={{ margin: '1.5em' }}></div>
        <h2>Uploaded Cover Letters</h2>
        <table>
          <thead>
            <tr>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.fileNames.map((fileName, index) => (
              <tr key={index}>
                <td>{fileName}</td>
                <td>
                  <Button className='btn-custom px-3 py-2 me-2' onClick={() => this.previewCoverLetter(index)}>Preview</Button>
                  <Button className='btn-danger px-3 py-2' onClick={() => this.deleteCoverLetter(index)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {this.state.coverLetterIdx !== null && (
          <CoverLetter setState={this.closeCoverLetterModal} idx={this.state.coverLetterIdx} />
        )}
      </div>
    );
  }
}
