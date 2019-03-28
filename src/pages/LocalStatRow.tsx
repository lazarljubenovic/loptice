import * as React from 'react'
import './LocalStatRow.scss'

interface Props {
  ticket: number[]
  correct: number[]
  moneyLost: number
  moneyGain: number
}

interface State {

}

export default class LocalStatRow extends React.Component<Props, State> {

  public render () {
    return (
      <div className="LocalStatRow">

        <div className="balls">
          {
            this.props.ticket.map(n => {
              const isCorrect = this.props.correct.includes(n)
              return (
                <span key={n}>{n}</span>
              )
            })
          }
        </div>

        <div className="gain">
          {this.props.moneyGain}
        </div>

        <div className="loss">
          {this.props.moneyLost}
        </div>

      </div>
    )
  }

}
