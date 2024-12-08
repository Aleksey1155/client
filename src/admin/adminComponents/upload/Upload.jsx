import { useState, useRef } from "react";
import "./upload.scss";
import config from "../../../config"
// const hostUrl = "http://localhost:3001/upload";


function Upload() {
  const filePicker = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState();

  const handleChange = (event) => {
    console.log(event.target.files);
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append(`file`, selectedFile);
    const res = await fetch(`${config.baseURL}/upload`, {
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    setUploaded(data);
  };

  const handlePick = () => {
    filePicker.current.click();
  };

  return (
    <div>
      <h2>Upload</h2>
      <button onClick={handlePick}>Pick file</button>
      <input
        className="hidden"
        ref={filePicker}
        type="file"
        onChange={handleChange}
        accept="image/*, .png, .jpg, .web"
      />
      <button onClick={handleUpload}>Upload now!</button>
      {selectedFile && (
        <ul>
          <li>Name: {selectedFile.name}</li>
          <li>Type: {selectedFile.type}</li>
          <li>Size: {selectedFile.size}</li>
        </ul>
      )}

      {uploaded && (
        <div>
          <h2>{uploaded.fileName}</h2>
          <img src={uploaded.filePath} alt="" width="200" />
        </div>
      )}
    </div>
  );
}

export default Upload;
