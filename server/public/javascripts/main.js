/* 
* @Author: hal
* @Date:   2015-05-22 14:00:21
* @Last Modified by:   nathanbailey
* @Last Modified time: 2015-06-13 14:02:26
*/
'use strict';
// This file is the main entry point for browserify

// React requires
var React = require('react');
var Router = require('react-router');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// Components for two routes
var ReceiptList = require('./components/ReceiptList.react');
var SubmitReceipt = require('./components/SubmitReceipt.react');

// Main container component, all other components nest inside
var App = React.createClass({
  render: function() {
    return (
      <div className ="container-fluid">
     
       


        <Row>
          <Col md={12} className="main-content">
            <RouteHandler />
          </Col>
        </Row>
      </div>
    );
  }
});

   // <svg width="180" height="180">
   //           <circle cx="90" cy="90" r="90"  fill="rgba(48,48,56,0.1)" />
   //           <circle cx="90" cy="90" r="70"  fill="#2A528B" />
   //          </svg>
   //          
   //          
   //          
        //     <Row>
        //   <Col md={12} className = "image-wrapper">
        //     <img src = "../../images/eLogo.png" />
         
        //     <p>Interactive Bill Splitting</p>
        //   </Col>
        // </Row>



// Routing!
var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler = {SubmitReceipt} />
    <Route name="billPage" path="/:bill" handler={ReceiptList}/>
  </Route>
);

// Running Routes!
Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler />, document.getElementById('content'));
});
      
