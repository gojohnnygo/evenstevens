/* 
* @Author: Johnny Nguyen
* @Date:   2015-06-05 14:41:39
* @Last Modified by:   Nathan Bailey
* @Last Modified time: 2015-06-10 16:35:07
*/


var React = require('react');
var AppActions = require('../actions/AppActions');
var validBillName = require('../../../utils/regex').billName();
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;

/**
 * This component accepts billName input
 */
var TipPercentInputForm = React.createClass({
  /**
   * Get initial state.
   */
  getInitialState: function(){
    return {
      tipPercent: 0
    };
  },
  /**
   * Submits the form.
   * @param {Event} e The form onSubmit event.
   */
  handleSubmit: function(e){
    e.preventDefault();
    
    var tipPercent = e.target.value;
    
    // not sure if setting tip percent is necessary
    this.setState({tipPercent: tipPercent});

    // initiate addUser action
    AppActions.addTipPercent(tipPercent);
    
    return;
  },
  /**
   * Render form HTML for billName.
   */
  render: function() {
    // Hide if tipPercent has previously been input
    // if (!this.props.billName) {
    //   return null;
    // }
    if (!this.props.userName) {
      return null;
    }

    if (this.props.tipPercent) {
      return null;
    }
    
    return (
      <div className = "tip-input-wrapper">
        <p> Please select the tip percentage for your party </p>
        <div className = "tip-input btn-group btn-group-justified" role="group">
          <ButtonGroup bsSize="large">
            <Button className = "btn-primary" onClick={this.handleSubmit} value='15%'>15%</Button>
          </ ButtonGroup>
          <ButtonGroup bsSize="large">
            <Button className = "btn-primary" onClick={this.handleSubmit} value='18%'>18%</Button>
          </ ButtonGroup>
          <ButtonGroup bsSize="large">
            <Button className = "btn-primary" onClick={this.handleSubmit} value='20%'>20%</Button>
          </ ButtonGroup>
        </div>
      </div>
    );
  }
});

module.exports = TipPercentInputForm;