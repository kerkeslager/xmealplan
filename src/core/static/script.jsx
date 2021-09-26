class LoginSignUpForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignUpChecked: false
    };
  }

  async onSubmit(e) {
    e.preventDefault();
    if(e.target.querySelector('[name="sign-up"]').checked) {
      const username = e.target.querySelector('[name="username"]').value;
      const password = e.target.querySelector('[name="password"]').value;
      const confirmPassword = e.target.querySelector('[name="confirm-password"]').value;

      // TODO
      if(password !== confirmPassword) {
        throw 'Error';
      }

      const response = await fetch(
        '/api/v1/user',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            'username': username,
            'password': password
          })
        }
      );
      const user = await response.json();
      // TODO Log the user in or something
    } else {
      const username = e.target.querySelector('[name="username"]').value;
      const password = e.target.querySelector('[name="password"]').value;

      const response = await fetch(
        '/api/v1/auth',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            'username': username,
            'password': password
          })
        }
      );
      const user = await response.json();
      // TODO Refresh the data store user
    }
  }

  render() {
    const onSignUpCheckChange = e => {
      const checkbox = e.target;
      this.setState({ isSignUpChecked: (checkbox.checked === true) });
    };


    const formStyle = {
      display: 'flex',
      flexDirection:'column',
      alignItems:'flexStart',
      width: '100%',
      height: '100%'
    };

    const formRowStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flexStart',
      margin: '0 0 0.5rem 0'
    };

    return <form
        onSubmit={this.onSubmit.bind(this)}
        style={formStyle}>
      <span style={formRowStyle}>
        <label htmlFor='username'>username</label>
        <input type='text' name='username'></input>
      </span>

      <span style={formRowStyle}>
        <label htmlFor='password'>password</label>
        <input type='password' name='password'></input>
      </span>

      {
        this.state.isSignUpChecked ?
        <span style={formRowStyle}>
          <label htmlFor='confirm-password'>confirm</label>
          <input type='password' name='confirm-password'></input>
        </span> :
        null
      }

      <span style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <input
          type='checkbox'
          name='sign-up'
          onChange={ onSignUpCheckChange }
          style={{ marginRight: '0.5rem' }}>
        </input>
        <label htmlFor='sign-up'>sign up</label>
      </span>

      <input type='submit' value={this.state.isSignUpChecked ? 'sign up' : 'log in'}>
      </input>
    </form>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.loadUser();
  }

  async loadUser() {
    const response = await fetch(
      '/api/v1/user',
      {
        'headers': { 'Accept': 'application/json' }
      }
    );
    const user = await response.json();
    this.setState({ user: user });
  }

  render() {
    if(this.state.user === null) {
      return '...';
    }

    if(!this.state.user.is_authenticated) {
      return <LoginSignUpForm/>;
    }

    return <p>Hello, { this.state.user.name }</p>
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
