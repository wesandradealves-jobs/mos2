import React from 'react';
import { Route as ReactDOMRoute } from 'react-router-dom';

const Route = ({ component: Component, ...restProps }) => {
  return (
    <ReactDOMRoute {...restProps}>
      <Component />
    </ReactDOMRoute>
  );
};

export default Route;
