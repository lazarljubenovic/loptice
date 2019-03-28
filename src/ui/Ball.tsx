import * as React from 'react'
import './Ball.scss'

interface Props {
  isLocked?: boolean
  number: number
  marked?: boolean
  onClick?: () => void
}

const modulos = [
  'red',
  'green',
  'blue',
  'purple',
  'brown',
  'yellow',
  'orange',
  'gray',
]

export default class Ball extends React.Component<Props> {

  private onClick = () => {
    if (this.props.onClick == null) return
    this.props.onClick()
  }

  render () {
    const modulo = this.props.number % 8
    const color = modulos[modulo]

    const classNames = ['Ball', color]
    if (this.props.marked) classNames.push('marked')

    return (
      <div className={classNames.join(' ')}
           onClick={this.onClick}
      >
        { this.props.number }
      </div>
    )
  }

}

