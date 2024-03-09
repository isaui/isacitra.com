import AgoraRTC from "agora-rtc-sdk-ng"
import { decodeToken, isExpired } from "react-jwt";
const agoraSetting = {
    AGORA_APP_ID:  'd91d04d113ba4e6181f6da7f4cb9a1cc',
    AGORA_CERTIFICATE: '5ee0129a61234f65bd4bfd5619178643',
    config:{ 
    mode: "rtc", codec: "vp8",
  }
  }
export const verifyToken = (token)=>{
    try{
      const decoded = decodeToken(token);
      const isTokenExpired = isExpired(token);
      console.log(decoded)
      if(isTokenExpired){
        return false
      }
      if(!decoded){
        return false;
      }
      return true
     
    }catch(error){
          console.log(error)
          return false;
    }
  }
export const agoraClient = AgoraRTC.createClient({...agoraSetting.config})
export default agoraSetting
  