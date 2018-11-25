import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {passport} from '..';
import google from '../providers/google';
import {IAuthenticator} from '../types';
import {User} from '../providers/types';

interface State {
  loading: boolean;
  user: User | null;
}
class Demo extends React.Component<any, State> {
  state: State = {
    loading: true,
    user: null,
  };
  authenticator: IAuthenticator;

  constructor (props) {
    super(props);
    this.authenticator = passport({
      providers: {
        google: google({
          client_id: '305188012168-htfit0k0u4vegn0f6hn10rcqoj1m77ca.apps.googleusercontent.com',
        }),
      }
    });
    this.authenticator.onchange = this.onChange;
  }

  onChange = (user) => {
    this.setState({user});
  };

  mounted = false;

  componentWillUnmount () {
    this.mounted = false;
  }

  async componentDidMount ()  {
    this.mounted = true;
    await this.authenticator.load();
    this.setState({loading: false});
    if (this.authenticator.isSignedIn) {
      const user = this.authenticator.manager.user;
      this.setState({user});
    }
  }

  onGoogleSignIn = async () => {
    await this.authenticator.signIn('google');
  };

  onSignOut = async () => {
    await this.authenticator.signOut();
  };

  render () {
    if (this.state.loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    return (
      <div>
        {this.state.user &&
          <div>
            <img src={this.state.user.avatar} style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              overflow: 'hidden',
            }} />
          </div>
        }

        <br />
        <button onClick={this.onGoogleSignIn}>Sign in with Google!</button>
        <br />
        <button onClick={this.onSignOut}>Sign out</button>
      </div>
    );
  }
}

storiesOf('Client Passport|Demo', module)
  .add('Default', () => <Demo />);
