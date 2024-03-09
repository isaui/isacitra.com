import { toast } from "react-toastify";
export default async function getPermission  () {
    try{
      await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true // Gunakan state video
      // Gunakan state audio
    });
      
    }
    catch (error) {
      toast.error("DOM Exception: Permission denied by system")
    }
  }