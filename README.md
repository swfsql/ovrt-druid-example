# OVRT-DRUID-EXAMPLE &emsp; [![Build Status]][actions] [![Doc]][docurl]

[build status]: https://img.shields.io/github/workflow/status/swfsql/ovrt-druid-example/Rust/master
[actions]: https://github.com/swfsql/ovrt-druid-example/actions?query=branch%3Amaster
[doc]: https://img.shields.io/badge/-doc-brightgreen
[docurl]: https://swfsql.github.io/ovrt-druid-example/doc/ovrt_druid_example/index.html

App example making use of [ovrt-sys](https://github.com/swfsql/ovrt-sys).

## Online Testing

To test the latest working master branch, paste into your `C:\Program Files (x86)\Steam\steamapps\common\OVR Toolkit\customAppDebug.txt`:

```
https://swfsql.github.io/ovrt-druid-example/
```

And then re/start ovrt.

You may also open [that link](https://swfsql.github.io/ovrt-druid-example/) in your browser, but it will fail when trying to call a function that would have been defined by ovrt itself.

## Offline Build Testing

You'll need a [rust nightly toolchain](https://www.rust-lang.org/tools/install), [wasm-pack](https://rustwasm.github.io/docs/wasm-pack/prerequisites/index.html) (no need to install anything related to npm) and a file server such as [http](https://github.com/thecoshman/http#installation).

```bash
git clone https://github.com/swfsql/ovrt-druid-example.git
cd ovrt-druid-example
wasm-pack build --target web
http
```

And for testing it, point your `C:\Program Files (x86)\Steam\steamapps\common\OVR Toolkit\customAppDebug.txt` to:

```
http://localhost:8000/
```

And then re/start ovrt.

You may also open [that link](http://localhost:8000/) in your browser, but it will fail when trying to call a function that would have been defined by ovrt itself.

## Useful Links

- [druid/examples/hello_web](https://github.com/linebender/druid/tree/master/druid/examples/hello_web)
- [wasm-pack book](https://rustwasm.github.io/docs/wasm-pack/)
- [wasm-bindgen book](https://rustwasm.github.io/docs/wasm-bindgen/)
