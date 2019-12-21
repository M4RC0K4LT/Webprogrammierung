import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class App extends React.Component {
    state = {
        data: [],
      }
    
      // Code is invoked after the component is mounted/inserted into the DOM tree.
      componentDidMount() {
        const url =
          'http://localhost:3001/api/orders'
    
        fetch(url)
          .then(result => result.json())
          .then(result => {
            this.setState({
              data: result,
            })
          })
      }
    
      render() {
        const { data } = this.state
    
        const result = data.map((entry, index) => {
          return <li key={index}>{entry}</li>
        })
    
        return <ul>{result}</ul>
      }
    }

  ReactDOM.render(<App />, document.getElementById('root'))