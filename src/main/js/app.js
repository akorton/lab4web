import React from 'react';
import ReactDOM from 'react-dom';
import Client from 'rest';

let App = ()=>{
    const greeting = 'Hello world!';
    return <h1>{greeting}</h1>;
};

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
