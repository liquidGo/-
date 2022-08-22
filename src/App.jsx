import axios from 'axios'
import React, { useEffect } from 'react'
import './App.css'

export default function App() {
  useEffect(() => {
    axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E7%A7%A6%E7%9A%87%E5%B2%9B&ci=122&channelId=4")
      .then((res) => console.log(res.data));
  }, []);
  return (
    <div>
      焯
    </div>
  )
}
