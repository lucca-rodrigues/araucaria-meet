import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MeetingRoomServices } from "../domain";

export default function useMeetingRoom() {  
  const service = new MeetingRoomServices();
  const [pageData, setPageData] = useState()

  const navigate = useNavigate(); 
  const { control, handleSubmit, watch, setValue, register, formState: { errors } } = useForm();
  const watchFields = watch();

  const [isLoading, setIsLoading] = useState(false); 

  async function getMeetingRoom() {
    const response = await service.get();
    setPageData(response);
  }

  return { 
    isLoading, 
    setIsLoading,
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    watchFields,
    navigate,
    getMeetingRoom,
    pageData,
    errors,
    register
  }; 
}