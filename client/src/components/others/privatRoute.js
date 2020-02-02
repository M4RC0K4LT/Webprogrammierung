import React from 'react';
import { Route, Redirect } from 'react-router-dom';
 
const PrivateRoute = ({ ...props }) => {
    if (sessionStorage.getItem("authToken") != null){
      return (<Route { ...props } />);
    }else {
      return <Redirect to="/login" />
    }
}

export default PrivateRoute;