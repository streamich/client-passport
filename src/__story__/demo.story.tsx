import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {passport} from '..';
import {IAuthenticator} from '../types';
import {User} from '../providers/types';
import {loadFBSdk} from '../providers/facebook/fb';

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
        /*
        google: () => Promise.resolve(google({
          client_id: '305188012168-htfit0k0u4vegn0f6hn10rcqoj1m77ca.apps.googleusercontent.com',
        })),
        */
       /*
        google: () => google({
          client_id: '305188012168-htfit0k0u4vegn0f6hn10rcqoj1m77ca.apps.googleusercontent.com',
        }),
        */
       /*
        google: async () => {
          const google = (await import('../providers/google')).default;
          return google({
            client_id: '305188012168-htfit0k0u4vegn0f6hn10rcqoj1m77ca.apps.googleusercontent.com',
          });
        },
       */
        google: async () => ({
          loader: (await import('../providers/google')).loader,
          options: {
            client_id: '305188012168-htfit0k0u4vegn0f6hn10rcqoj1m77ca.apps.googleusercontent.com',
          },
        }),
      }
    });
    this.authenticator.onchange = this.onChange;
  }

  onChange = (user) => {
    if (!this.mounted) return;
    // tslint:disable-next-line
    console.info('onChange', user);
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

    const fb = await loadFBSdk();
    fb.init({
      appId: '253302651812049',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v3.2',
    });
    /*
    fb.getLoginStatus((response) => {
      console.log('resp', response.status);
    });
    */
    // /*
    setTimeout(() => {
      FB.login(function(response) {
        console.log('res', response)
        if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
          console.log('Good to see you, ' + response.name + '.');
        });
        } else {
        console.log('User cancelled login or did not fully authorize.');
        }
      });
    }, 1000);
    // */
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
