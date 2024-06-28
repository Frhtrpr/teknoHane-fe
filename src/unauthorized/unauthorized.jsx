import { Typography } from "@mui/material";
import React from "react"
import { Link } from "react-router-dom";

function Unauthorized () {
    return(
        <>
         <Typography variant="h3" sx={{marginTop:'50px', marginLeft:'80px'}}>BU ALANDA YETKİNİZ BULUNMAMAKTADIR</Typography>
         <Typography variant="h5" sx={{marginTop:'20px', marginLeft:'90px'}}><Link to="/teknoHane">Ana Sayfa</Link></Typography>
        </>
    )
}

export default Unauthorized;