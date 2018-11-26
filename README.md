# client-passport

Universal authentication for client-side apps, supported providers:

- [x] Google Sign-in for Websites
- [x] Facebook SDK


## Usage

Create `authenticator` instance.

```js
import {passport} from 'client-passport';
import {loader as facebookLoader} from 'client-passport/lib/providers/facebook';

const authenticator = passport({
  providers: {
    google: async () => ({
      loader: (await import('client-passport/lib/providers/google')).loader,
      options: {
        client_id: 'xxxxxxxxxx-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy.apps.googleusercontent.com',
      },
    }),
    facebook: () => ({
      loader: facebookLoader,
      options: {
        appId: '00000000000000',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.2',
      }
    }),
  }
});
```

Subscribe to `user` changes. Every time user logs in this callback is called. When
user logs out, `user` is set to `null`.

```js
authenticator.onchange = (user) => {
   //
};
```

Sign-in with selected provider.

```js
user = await authenticator.signIn('google');
user = await authenticator.signIn('facebook');
```

Sign-out.

```js
await authenticator.signOut();
```


## License

[Unlicense](LICENSE) &mdash; public domain.
