import React, { Component } from 'react'
import $ from 'jquery'
import '../static/resume.css'
import CoverLetter from '../Modals/CoverLetter'
import ResumeFeedback from '../Modals/ResumeFeedback'

export default class ManageResumePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileNames: [],
      loading: false,
      coverLetterIdx: null,
      resumeFeedbackIdx: null
    }
  }

  getFiles() {
    $.ajax({
      url: 'http://127.0.0.1:5000/resume',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
        'Access-Control-Allow-Credentials': 'true'
      },
      credentials: 'include',
      success: (message, textStatus, response) => {
        console.log(message)
        this.setState({
          fileNames: message.filenames || []
        })
      }
    })
  }

  openCoverLetterModal = (idx) => {
    this.setState({ coverLetterIdx: idx });
  }

  closeCoverLetterModal = () => {
    this.setState({ coverLetterIdx: null });
  }

  openResumeFeedbackModal = (idx) => {
    this.setState({ resumeFeedbackIdx: idx });
  }

  closeResumeFeedbackModal = () => {
    this.setState({ resumeFeedbackIdx: null });
  }

  previewResume(resume_idx) {
    $.ajax({
      url: 'http://127.0.0.1:5000/resume/' + resume_idx,
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

  deleteResume(resume_idx) {
    $.ajax({
      url: 'http://127.0.0.1:5000/resume/' + resume_idx,
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
        'Access-Control-Allow-Credentials': 'true'
      },
      success: (message, textStatus, response) => {
        alert("Resume deleted successfully!");
        this.state.fileNames.splice(resume_idx, 1);
        console.log(response.responseJSON.success);
        this.getFiles();
      }
    })
  }

  uploadResume = (e) => {
    e.preventDefault();

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf"; // Adjust allowed file types if needed

    fileInput.addEventListener("change", (event) => {
      if (event.target.files.length === 0) {
        return;
      }

      this.setState({ loading: true });
      let formData = new FormData()
      const file = event.target.files[0];
      formData.append('file', file);
      $.ajax({
        url: 'http://127.0.0.1:5000/resume',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
          'Access-Control-Allow-Credentials': 'true'
        },
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        success: (msg) => {
          console.log("Upload successful:", msg)
          this.setState({ fileNames: [...this.state.fileNames, file.name] })
        }
      }).always(() => this.setState({ loading: false }))

    });

    fileInput.click();
  }

  componentDidMount() {
    this.getFiles()
  }

  componentWillUnmount() {
    if (this.state.previewUrl) {
      URL.revokeObjectURL(this.state.previewUrl);
    }
  }


  render() {
    return (
      <div className="pagelayout">

        <form id="upload-file" method="post" encType="multipart/form-data">
          <button
            id="upload-file-btn"
            onClick={(event) => {
              if (!this.state.loading) {
                this.uploadResume(event)
              }
            }}
            disabled={this.state.loading}
            type="button"
            style={{
              display: 'block',
              margin: '0 auto'
            }}
          >
            {this.state.loading ? 'Uploading...' : 'Upload New'}
          </button>

          <div style={{ margin: '1.5em' }}></div>
          <div>
            <h2>Uploaded Documents</h2>
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
                      <button
                        id="view-file-btn"
                        onClick={() => this.previewResume(index)}
                        type="button"
                      >
                        Preview
                      </button>
                      <button
                        id="view-file-btn"
                        onClick={() => this.openResumeFeedbackModal(index)}
                        type="button"
                      >
                        View Feedback
                      </button>
                      <button
                        id="view-file-btn"
                        onClick={() => this.openCoverLetterModal(index)}
                        type="button"
                      >
                        Generate Cover Letter
                      </button>
                      <button
                        id="delete-file-btn"
                        onClick={() => this.deleteResume(index)}
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {this.state.coverLetterIdx !== null && (
            <CoverLetter
              setState={this.closeCoverLetterModal}
              idx={this.state.coverLetterIdx}
            />
          )}
          {this.state.resumeFeedbackIdx !== null && (
            <ResumeFeedback
              setState={this.closeResumeFeedbackModal}
              idx={this.state.resumeFeedbackIdx}
            />
          )}
        </form>
      </div>
    )
  }
}
