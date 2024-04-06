import { useState } from "react";
import axios from "axios";

function PostUploadForm() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);

      await axios.post("/api/upload", formData);

      // Clear form fields
      setFile(null);
      setDescription("");
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <div>
      <h2>Upload Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter description (optional)"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default PostUploadForm;
