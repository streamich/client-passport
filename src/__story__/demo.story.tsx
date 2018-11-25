import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {passport} from '..';
import google from '../providers/google';
import {IAuthenticator} from '../types';

interface State {
  loading: boolean;
}
class Demo extends React.Component<any, State> {
  state: State = {
    loading: true,
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
  }

  async componentDidMount ()  {
    await this.authenticator.load();
    this.setState({loading: false});
    console.log('is in', this.authenticator.isSignedIn);
  }

  onGoogleSignIn = async () => {
    const user = await this.authenticator.signIn('google');
    console.log('user', user);
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
        <div>
          {/* <img src={this.} /> */}
        </div>

        <button onClick={this.onGoogleSignIn}>Sign in with Google!</button>
      </div>
    );
  }
}

storiesOf('Client Passport|Demo', module)
  .add('Default', () => <Demo />);
