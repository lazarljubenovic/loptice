import React, { Component } from 'react'
import './App.scss'
import * as SnackBar from './ui/SnackBar'
import './firebase'
import Id from './pages/Identification'
import Play from './pages/Play'
import Stats from './pages/Stats'
import Firebase from './firebase'

interface State {
  page: 'key' | 'id' | 'play' | 'stats'
}

export default class App extends Component<{}, State> {

  private firebase = new Firebase()

  constructor (props: {}) {
    super(props)

    let page: State['page'] = 'play'

    const key = localStorage.getItem('key')
    const username = localStorage.getItem('username')

    if (username == null) page = 'id'

    this.state = {
      page,
    }
  }

  private onIdDone = (username: string) => {
    console.log(username)
    localStorage.setItem('username', username)
    this.setState({
      page: 'play',
    })
  }

  private goToPlayTab  = () => {
    this.setState({page: 'play'})
  }

  private goToStatsTab = () => {
    this.setState({page: 'stats'})
  }

  componentDidMount (): void {
  }

  render () {
    return (
      <SnackBar.Provider>
        {/*{this.state.page == 'key' && <Key/>}*/}
        {this.state.page == 'id' && <Id firebase={this.firebase} onDone={this.onIdDone}/>}
        {this.state.page == 'play' && <Play firebase={this.firebase} onStatsTab={this.goToStatsTab}/>}
        {this.state.page == 'stats' && <Stats firebase={this.firebase} onPlayTab={this.goToPlayTab}/>}
      </SnackBar.Provider>
    )
  }
}
