# Playground face-api.js
Playing around with [`face-api.js`].

## Run development server
Using [`miniserve`] for the development server.  
Run the `launch` script ...
```
bin/launch
```
to start the server.  
The script will prompt you to install [`miniserve`] if it isn't installed yet.  
_(needs `cargo` to install `miniserve`)_

By default, the page will be served at [`localhost:8080/index.html`](http://localhost:8080/index.html).

Any command-line arguments for the `launch` script are passed  
to the underlying `miniserve` command.  
See `miniserve --help` for more info.  
For example, to specify a custom interface and port for the server to run on ...
```
bin/launch -i 0.0.0.0 -p 3000
```

## License
Distributed under the terms of the [MIT license][license].

[`face-api.js`]: https://github.com/justadudewhohacks/face-api.js
[`miniserve`]:   https://github.com/svenstaro/miniserve
[license]:       ./LICENSE
