//! Defines what effects are made by events/callbacks.
//!
//! See [blocking functions](https://github.com/linebender/druid/blob/master/druid/examples/blocking_function.rs)
//! for more information.

use crate::{
    app::{AppData, Overlay},
    sink::Delegate,
};
use ovrt_sys::{self as sys, log};

/// This links a druid event (by using the `Selector`) with a `ovrt_sys::cmd::Command`.
pub const OVRT_COMMAND: druid::Selector<sys::cmd::Command> = druid::Selector::new("ovrt_command");

impl druid::AppDelegate<AppData> for Delegate {
    fn command(
        &mut self,
        _ctx: &mut druid::DelegateCtx,
        _target: druid::Target,
        cmd: &druid::Command,
        data: &mut AppData,
        _env: &druid::Env,
    ) -> bool {
        #[allow(unused_imports)]
        use sys::cmd::{
            Callback as Call, Command, Event as Evt, EventResponse as EvtR, Notification as Not,
        };

        // catching all ovrt-sys commands.
        if let Some(ovrt_cmd) = cmd.get(OVRT_COMMAND) {
            use Command::Callback as CCall;
            use Command::Event as CEvt;
            use Command::EventResponse as CEvtR;
            use Command::Notification as CNot;

            log!(format!("{:#?}", ovrt_cmd));

            match ovrt_cmd {
                // ignore all feedback notifications
                CNot(_) => {}
                // overlay finished spawning
                CEvtR(EvtR::FinishSpawnOverlay(uid)) | CCall(Call::FinishSpawnOverlay(uid)) => {
                    let ov = data
                        .overlays
                        .back_mut()
                        .expect("expecting some overlay item");
                    // the last overlay should be an spawning one
                    // otherwise something must have gone wrong
                    assert_eq!(Overlay::Spawning, *ov);
                    // spawning -> live
                    *ov = Overlay::Live(uid.clone());
                }
                // overlay finished closing
                CEvtR(EvtR::FinishCloseOverlay(uid)) => {
                    let (i, _uid) = data
                        .overlays
                        .iter()
                        .enumerate()
                        // only looking at the currently closing overlays
                        .filter_map(|(i, ov)| match ov {
                            Overlay::Closing(inner_uid) => Some((i, inner_uid)),
                            _ => None,
                        })
                        // where the uid is the correct one
                        .find(|(_i, inner_uid)| *inner_uid == uid)
                        .expect("could not find the uid of the removed overlay");
                    // closing -> remove
                    data.overlays.remove(i);
                }
                // ignore remaining events
                CEvt(_) => {}
                // ignore remaining callbacks
                CCall(_) => {}
            };
        } else {
            // ignoring all non-ovrt-sys commands.
            log!("command ran (empty)");
        };

        true
    }
}
