import * as React from 'react'
import './Stats.scss'
import * as SnackBar from '../ui/SnackBar'
import Firebase, { Game, User } from '../firebase'
import LocalStatRow from './LocalStatRow'

interface Props {
  firebase: Firebase
  onPlayTab: () => void
}

interface GlobalStat {
  username: string
  totalGain: number
  totalLoss: number
}

interface State {
  globalStats: GlobalStat[]
  localStats: Game[]
}

export default class EnterKey extends React.Component<Props, State> {

  private _isMounted: boolean = false

  private shouldSetStateAfterMounted: boolean = false

  private users: User[] = []
  private games: Game[] = []

  constructor (props: Props) {
    super(props)

    this.state = {
      globalStats: [],
      localStats: [],
    }

    this.props.firebase.users().on('value', ss => {
      if (ss == null) return
      this.users = ss.val() || []
      console.log('this.users', this.users)
      this.compute()
    })

    this.props.firebase.games().on('value', ss => {
      if (ss == null) return
      this.games = ss.val() || []
      console.log('this.games', this.games)
      this.compute()
    })
  }

  public componentDidMount (): void {
    this._isMounted = true
    if (this.shouldSetStateAfterMounted) this.compute()
  }

  public componentWillUnmount (): void {
    this._isMounted = false
  }

  private compute () {
    if (!this._isMounted) {
      console.log('not mounted')
      this.shouldSetStateAfterMounted = true
      return
    }

    console.log('computing')

    const { users, games } = this

    const username = localStorage.getItem('username') || 'Unknown'
    const myUser = users.find(u => u.username == username)!

    const history = myUser.history || []

    const myGames = games.filter((game, index) => {
      return history.includes(index)
    })

    const globalStats: GlobalStat[] = users.map(user => {
      const hisGames = games.filter((game, index) => {
        return (user.history || []).includes(index)
      })

      let totalGain: number = 0
      let totalLoss: number = 0
      for (const game of hisGames) {
        totalGain += game.moneyGain
        totalLoss += game.moneyLost
      }

      return {
        username: user.username,
        totalGain,
        totalLoss,
      }
    })

    this.setState({
      globalStats,
      localStats: myGames,
    })
  }

  render () {
    return (
      <SnackBar.Consumer>
        {
          (ctx) => (
            <>

              <div className="page Stats">

                <div className="stats-wrapper">

                  <div className="global">

                    <table>
                      <tbody>
                      {
                        this.state.globalStats.map((stat, index) => {
                          const total = stat.totalGain - stat.totalLoss
                          const totalClassNames = ['total']
                          if (total > 0) totalClassNames.push('positive')
                          if (total < 0) totalClassNames.push('negative')
                          return (
                            <tr key={stat.username}>
                              <td className="number">{index + 1}</td>
                              <td className="username">{stat.username}</td>
                              <td className="gain"> +{stat.totalGain} </td>
                              <td className="loss"> -{stat.totalLoss} </td>
                              <td className={totalClassNames.join(' ')}>{total}</td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>

                  </div>

                  <div className="self">


                    {
                      this.state.localStats.map((stat, index) => {
                        return (
                          <LocalStatRow
                            key={stat.date.toString() + index}
                            ticket={stat.ticket || []}
                            correct={stat.correct || []}
                            moneyLost={stat.moneyLost || 0}
                            moneyGain={stat.moneyGain || 0}
                          />
                        )
                      })
                    }

                  </div>

                </div>

                <div className="tabs">
                  <button onClick={this.props.onPlayTab}>Igra</button>
                  <button className="active">Statistika</button>
                </div>

              </div>

            </>
          )
        }
      </SnackBar.Consumer>
    )
  }
}
