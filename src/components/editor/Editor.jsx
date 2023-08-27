import React, { useEffect, useState , useRef} from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import { Storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


export const Editor = ({setText, initialText}) => {
  const [state, setState] = useState('');
  const quillRef = useRef(null)
  const handleChange = value => {
    setText(value);
    setState(value);
  };
  const handler = {
    image: () => {
      // Membuka dialog unggah gambar saat tombol gambar diklik
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      // Menangani unggah gambar saat gambar dipilih
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        handleImageUpload(file);
      });
    },
  }
  modules.toolbar.handlers = {...modules.toolbar.handlers, ...handler}



  const GetURLFromFirebase = async (file) => {
    if (!file) {
      return;
    }
  
    const storageRef = ref(Storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    try {
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Lakukan tindakan setelah mendapatkan URL gambar dari Firebase
      // Misalnya, Anda dapat memperbarui state, mengirim URL ke server, dll.
       // Contoh: mencetak URL ke konsol
  
      return downloadURL;
    } catch (error) {
      console.error(error);
      alert(error.message); // Menampilkan pesan kesalahan
      throw error; // Melempar error untuk penanganan lebih lanjut jika perlu
    }
  };
  
  const handleImageUpload = async (file) => {
    try {
      const imageUrl = await GetURLFromFirebase(file);

      const quillEditor = quillRef.current.getEditor();
      const range = quillEditor.getSelection();
      quillEditor.insertEmbed(range.index, "image", imageUrl);
    } catch (error) {
      console.error(error);
    }
  };
 useEffect(()=>{
  
  setState(initialText)
 }, [initialText])

  return (
    <div className="text-editor">
      <EditorToolbar />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={state}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        
      />
    </div>
  );
};

export default Editor;