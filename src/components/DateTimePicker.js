import React from 'react';
import DatePicker from 'react-datepicker';
import { Navbar } from 'react-bootstrap';

import 'react-datepicker/dist/react-datepicker.css';

import './DateTimePicker.scss';

export class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(date) {
    this.setState({
      date: date
    }, () => {
      this.props.onSelect();
    });
  }

  render() {
    return (
      <Navbar class="bottom-navbar" bg="dark" variant="dark" expand="lg" fixed="bottom" >
        <div className="date-picker ml-auto">
          <DatePicker
            selected={this.state.date}
            onChange={this.handleDateChange}
            dateFormat='dd/MM/yyyy hh:mm a'
            showTimeSelect
            timeIntervals={15}
            maxDate={new Date()}
          />
        </div>
      </Navbar>
    );
  }
}
