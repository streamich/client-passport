import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {passport} from '..';
import {IAuthenticator} from '../types';
import {User} from '../providers/types';
import {loadFBSdk} from '../providers/facebook/fb';
import {loader as facebookLoader} from '../providers/facebook';

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
        facebook: () => ({
          loader: facebookLoader,
          options: {
            appId: '253302651812049',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v3.2',
          }
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
  }

  onGoogleSignIn = async () => {
    await this.authenticator.signIn('google');
  };

  onFacebookSignIn = async () => {
    const user = await this.authenticator.signIn('facebook');
    // tslint:disable-next-line
    console.log('facebook signIn response', user);
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
            <div>{this.state.user.name}</div>
            <div>token: {this.state.user.token}</div>
          </div>
        }

        <hr />
        <br />
        <button onClick={this.onGoogleSignIn}>Sign in with Google!</button>
        <br />
        <button onClick={this.onFacebookSignIn}>Sign in with Facebook!</button>
        <br />
        <button onClick={this.onSignOut}>Sign out</button>
      </div>
    );
  }
}

storiesOf('Client Passport|Demo', module)
  .add('Default', () => <Demo />);
