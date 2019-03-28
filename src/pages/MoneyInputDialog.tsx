import * as React from 'react'
import { FormEvent } from 'react'
import './MoneyInputDialog.scss'
import Button from '../ui/Button'

interface Props {
  numbers: number[][]
  marked: [number, number][]
  onAccept?: (money: number[]) => void
  onCancel?: () => void
  isAcceptLoading: boolean
}

interface State {
  money: number[]
}

export default class MoneyInputDialog extends React.Component<Props, State> {

  public constructor (props: Props) {
    super(props)
    const length = props.numbers.length
    this.state = {
      money: Array.from({ length }).map(_ => 0),
    }
  }

  private onAccept = () => {
    if (this.props.onAccept == null) return
    this.props.onAccept(this.state.money)
  }

  private onCancel = () => {
    if (this.props.onCancel == null) return
    this.props.onCancel()
  }

  private setMoney = (index: number, event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const value = target.valueAsNumber
    const money = [
      ...this.state.money.slice(0, index),
      value,
      ...this.state.money.slice(index + 1),
    ]
    this.setState({ money })
  }

  public render () {
    return (
      <div className="dialog-wrapper">
        <div className="dialog MoneyInputDialog">

          <table>
            <tbody>
            <tr>
              <td colSpan={6}>Kombinacija</td>
              <td>Out</td>
              <td>In</td>
            </tr>
            {
              this.props.numbers.map((numbers, numbersIndex) => {
                let areAllMarked = true

                return (
                  <tr key={numbersIndex}>
                    {
                      numbers.map((number, numberIndex) => {
                        const isMarked = this.props.marked.find(([a, b]) => {
                          return a == numbersIndex && b == numberIndex
                        }) != null
                        if (!isMarked) areAllMarked = false
                        const classNames = []
                        if (isMarked) classNames.push('marked')
                        return (
                          <td key={numberIndex} className={classNames.join(' ')}>
                            {number}
                          </td>
                        )
                      })
                    }
                    <td>
                      <input type="number" defaultValue={'20'}/>
                    </td>
                    <td>
                      <input
                        type="number"
                        defaultValue={areAllMarked ? '' : '0'}
                        onInput={event => this.setMoney(numbersIndex, event)}
                      />
                    </td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>

          <div className="buttons">
            <Button secondary onClick={this.onCancel}>Nazad</Button>
            <Button isLoading={this.props.isAcceptLoading} onClick={this.onAccept}>Prihvati</Button>
          </div>

        </div>
      </div>
    )
  }

}
