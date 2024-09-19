import React, { Component } from 'react'
import ImagesAI from '../ImagesAI/ImagesAI'
import AttendeceAI from '../AttendanceAI/AttendanceAI'

export class AI extends Component {
  render() {
    return (
      <>
        <ImagesAI/>
        <AttendeceAI/>
      </>
    )
  }
}

export default AI