const Cookie = {
  get: name => {
    name += '=';
    let decodedCookies = decodeURIComponent(document.cookie).split(';');
    for(let c of decodedCookies) {
      c = c.replace(/^\s\s*/,'');
      if (c.indexOf(name) == 0) {
        return c.substring(name.length);
      }
    }
    return null;
  }
};

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
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookie.get('csrftoken'),
          },
          method: 'POST',
          body: JSON.stringify({
            'username': username,
            'password': password
          })
        }
      );
      const user = await response.json();
      // TODO Check result

      this.props.onComplete();
    } else {
      const username = e.target.querySelector('[name="username"]').value;
      const password = e.target.querySelector('[name="password"]').value;

      const response = await fetch(
        '/api/v1/auth',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookie.get('csrftoken'),
          },
          method: 'POST',
          body: JSON.stringify({
            'username': username,
            'password': password
          })
        }
      );
      const user = await response.json();
      // TODO Check result
      this.props.onComplete();
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

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0
    };

    // Increment the timer every third of a second
    setInterval(
      () => {
        this.setState({ timer: (this.state.timer + 1) % 20 });
      },
      100
    );
  }

  render() {
    const sup = {
      verticalAlign: 'super',
      lineHeight: '1pt'
    };

    if(this.state.timer % 20 === 0) {
      return <span>..<span style={sup}>.</span></span>;
    }
    if(this.state.timer % 20 === 1) {
      return <span>.<span style={sup}>..</span></span>;
    }
    if(this.state.timer % 20 === 2) {
      return <span><span style={sup}>..</span>.</span>;
    }
    if(this.state.timer % 20 === 3) {
      return <span><span style={sup}>.</span>..</span>;
    }

    return '...';
  }
}

class PlanCreate extends React.Component {
  render() {
    const onSubmit = e => {
      console.log(e);
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

    return <div>
      <h1>Create your Exchange Meal Plan!</h1>
      <form onSubmit={onSubmit} style={formStyle}>
        <span style={formRowStyle}>
          <label htmlFor='name'>name</label>
          <input type='text' name='name' value='My Meal Plan'></input>
        </span>

        <p>Every day I want to eat:</p>

        <span style={formRowStyle}>
          <label htmlFor='starch'>starch</label>
          <input type='number' name='starch' step='1' pattern='\d+'></input>
        </span>

        <span style={formRowStyle}>
          <label htmlFor='fruit'>fruit</label>
          <input type='number' name='fruit' step='1' pattern='\d+'></input>
        </span>

        <span style={formRowStyle}>
          <label htmlFor='dairy'>dairy</label>
          <input type='number' name='dairy' step='1' pattern='\d+'></input>
        </span>

        <span style={formRowStyle}>
          <label htmlFor='vegetable'>vegetable</label>
          <input type='number' name='vegetable' step='1' pattern='\d+'></input>
        </span>

        <span style={formRowStyle}>
          <label htmlFor='protein'>protein</label>
          <input type='number' name='protein' step='1' pattern='\d+'></input>
        </span>

        <span style={formRowStyle}>
          <label htmlFor='fat'>fat</label>
          <input type='number' name='fat' step='1' pattern='\d+'></input>
        </span>

        <input type='submit' value='save'>
        </input>
      </form>
    </div>;
  }
}

class Wrapper extends React.Component {
  render() {
    return <div>
      <header style={{marginBottom: '1rem'}}>
        Hello, { this.props.user.name }. &nbsp;
        <a href='#' onClick={this.props.onLogout}>Logout</a>
      </header>

      <main>
        { this.props.children }
      </main>

      <footer style={{marginTop: '1rem'}}>
        All code is released under the AGPL 3.0. &nbsp;
        <a href='https://github.com/kerkeslager/xmealplan'>Code</a>
      </footer>
    </div>;
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
      '/api/v1/user/me',
      {
        'headers': { 'Accept': 'application/json' }
      }
    );
    const user = await response.json();
    this.setState({ user: user });
  }

  async logout(e) {
    e.preventDefault();
    const response = await fetch(
      '/api/v1/auth',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookie.get('csrftoken'),
        },
        method: 'DELETE',
        body: JSON.stringify({})
      }
    );
    const user = await response.json();

    this.loadUser();
  }

  render() {
    if(this.state.user === null) {
      return <Loading/>;
    }

    if(!this.state.user.is_authenticated) {
      return <LoginSignUpForm onComplete={this.loadUser.bind(this)}/>;
    }

    if(!this.state.user.plan) {
      return <Wrapper user={this.state.user}>
        <PlanCreate />
      </Wrapper>;
    }

    return <Wrapper user={this.state.user} onLogout={this.logout.bind(this)}>
      <Loading/>
    </Wrapper>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
