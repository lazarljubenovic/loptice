import * as React from 'react'
import './Play.scss'
import * as SnackBar from '../ui/SnackBar'
import Button from '../ui/Button'
import Ball from '../ui/Ball'
import MoneyInputDialog from './MoneyInputDialog'
import Firebase, { Game } from '../firebase'

function getRandomIntInclusive (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getSixNumbers () {
  const numbers: number[] = []
  let i = 0
  while (i < 6) {
    const random = getRandomIntInclusive(1, 48)
    if (numbers.includes(random)) continue
    numbers[i++] = random
  }
  return numbers.sort((a, b) => a > b ? 1 : -1)
}

interface Props {
  firebase: Firebase
  onStatsTab: () => void
}

interface State {
  username: string

  count: number

  numbers: number[][]
  marked: [number, number][]

  isSubmenuOpen: boolean
  isAcceptLoading: boolean

  isCountMenuOpen: boolean

  isNewCombinationsDisabled: boolean
}

export default class EnterKey extends React.Component<Props, State> {

  private changeCount = (count: number) => {
    this.setState({
      count,
      isCountMenuOpen: false,
    })
  }

  private generateNumbers = () => {
    const numbers: number[][] = []
    for (let i = 0; i < this.state.count; i++) {
      numbers.push(getSixNumbers())
    }
    this.setState({
      numbers,
      marked: [],
    })
  }

  private openSubmenu = async () => {
    this.setState({
      isSubmenuOpen: true,
    })
  }

  private closeSubmenu = () => {
    this.setState({
      isSubmenuOpen: false,
    })
  }

  private toggleCountMenu = () => {
    this.setState({
      isCountMenuOpen: !this.state.isCountMenuOpen,
    })
  }

  private toggleNumberMark (rowIndex: number, numberIndex: number): void {
    const index = this.state.marked.findIndex(([a, b]) => a == rowIndex && b == numberIndex)
    const { marked } = this.state
    if (index == -1) {
      const pair = [rowIndex, numberIndex] as [number, number]
      const newMarked = [...marked, pair]
      this.setState({ marked: newMarked })
    } else {
      const newMarked = [...marked.slice(0, index), ...marked.slice(index + 1)]
      this.setState({ marked: newMarked })
    }
  }

  private acceptMoney = async (money: number[]) => {
    if (this.state.isAcceptLoading) return
    this.setState({ isAcceptLoading: true })
    console.log(money)

    const games: Game[] = []
    for (let i = 0; i < money.length; i++) {
      const moneyGain = money[i]
      const moneyLost = 20

      const correct = this.state.numbers[i].filter((_, j) => {
        return this.state.marked.find(([a, b]) => a == i && b == j) != null
      })


      games[i] = {
        moneyGain,
        moneyLost,
        ticket: this.state.numbers[i],
        correct,
        date: new Date().toString(),
      }
    }

    for (const game of games) {
      await this.props.firebase.saveGame(game)
    }

    this.setState({ isAcceptLoading: false, isSubmenuOpen: false })
  }

  private logOut = () => {
    localStorage.clear()
    location.reload()
  }

  constructor (props: Props) {
    super(props)
    this.state = {
      username: localStorage.getItem('username')!,
      count: 4,
      numbers: [
        [3, 7, 13, 21, 32, 42],
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18],
      ],
      marked: [],
      isSubmenuOpen: false,
      isAcceptLoading: false,
      isCountMenuOpen: false,
      isNewCombinationsDisabled: false,
    }
  }

  render () {
    return (
      <SnackBar.Consumer>
        {
          (ctx) => (
            <>
              <div className="page Play">

                <div className="name">
                  <span>{this.state.username}</span>
                  <button onClick={this.logOut}>Log out</button>
                </div>

                <div className="balls">
                  <div className="balls-inner">
                    {
                      this.state.numbers.map((row, rowIndex) => {
                        return (
                          <div className="row" key={rowIndex}>
                            {
                              row.map((number, numberIndex) => {
                                const marked = this.state.marked.findIndex(([a, b]) => a == rowIndex && b == numberIndex) > -1
                                return (
                                  <Ball onClick={() => this.toggleNumberMark(rowIndex, numberIndex)}
                                        number={number}
                                        key={number}
                                        marked={marked}
                                  />
                                )
                              })
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>

                <div className="again buttons">
                  <div style={{ flex: 5 }} className="generate-wrapper">
                    <Button onClick={this.generateNumbers}>Nove kombinacije</Button>
                  </div>
                  <div style={{ flex: 1 }} className="count-wrapper">
                    <Button
                      onClick={this.toggleCountMenu}
                      secondary={this.state.isCountMenuOpen}
                    >
                      {this.state.isCountMenuOpen ? '▼' : this.state.count}
                    </Button>

                    <div className="submenu" hidden={!this.state.isCountMenuOpen}>
                      {
                        Array.from({ length: 6 }).map((_, i) => {
                          return (
                            <Button
                              key={i + 1}
                              secondary={this.state.count != i + 1}
                              onClick={() => this.changeCount(i + 1)}
                            >
                              {i + 1}
                            </Button>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>

                {
                  <div className="save-closed">
                    <Button onClick={this.openSubmenu}>Završi kolo</Button>
                  </div>
                }

                <div className="tabs">
                  <button className="active">Igra</button>
                  <button onClick={this.props.onStatsTab}>Statistika</button>
                </div>

              </div>

              {
                this.state.isSubmenuOpen &&
                <MoneyInputDialog
                  numbers={this.state.numbers}
                  marked={this.state.marked}
                  onAccept={this.acceptMoney}
                  onCancel={this.closeSubmenu}
                  isAcceptLoading={this.state.isAcceptLoading}
                />
              }

            </>
          )
        }
      </SnackBar.Consumer>
    )
  }
}
