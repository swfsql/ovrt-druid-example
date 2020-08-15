//! This organizes how ovrt-sys passes events/callbacks into this
//! druid app instance. But in short, this is boilerplate.
//!
//! The function `submit_cmd` is passed to `ovrt_sys`, which forwards
//! events/callbacks into that function.  
//! The function, on ther other hand, need access into the
//! `ExtEventSink`, which is always available as a static instance
//! defined in this module (see `druid_global_event_sink`).
//!
//! See `ovrt_sys::cmd::sink` and druid's
//! [blocking functions](https://github.com/linebender/druid/blob/master/druid/examples/blocking_function.rs)
//! for more information.

use crate::{app::AppData, cmd::OVRT_COMMAND};
use druid::{AppLauncher, ExtEventSink};
use once_cell::sync::OnceCell;
use ovrt_sys::{self as sys};

pub struct Delegate {
    // unneeded field since this will be static, but anyway..
    pub eventsink: ExtEventSink,
}

/// This function will receive every event/callback/etc commands
/// from ovrt-sys. See `ovrt_sys::cmd::sink` for more information.
fn submit_cmd(cmd: sys::cmd::Command) {
    druid_global_event_sink(None)
        .submit_command(OVRT_COMMAND, cmd.clone(), None)
        .unwrap_or_else(|e| {
            format!(
                "Command {:?} failed to get submit. Error {:?}",
                cmd, e
            );
        });
}

/// This function is used do access a static item that is able
/// to insert arbitrary commands/events into the Druid data/control
/// flow.  
/// One of such types of commands is the `cmd::OVRT_COMMAND`, which
/// will represent all kinds of events/callbacks from ovrt-sys.  
/// Check `cmd` and `ovrt_sys::cmd` for more information.
///
/// * `app_launcher` - This is acquired before lauching the druid app.
/// This is why the messages may be sent into the app's data/control
/// flow.
pub fn druid_global_event_sink(
    app_launcher: Option<&AppLauncher<AppData>>,
) -> &'static ExtEventSink {
    static EVENT_SINK: OnceCell<ExtEventSink> = OnceCell::new();
    EVENT_SINK.get_or_init(|| {
        sys::cmd::sink::global_command_sink(Some(submit_cmd));
        let app_launcher = app_launcher
            .expect("a running app_launcher is required when initializing the event_sink.");
        app_launcher.get_external_handle()
    })
}
