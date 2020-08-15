pub mod app;
pub mod cmd;
pub mod sink;

use self::{app::AppData, sink::Delegate};
use druid::{AppLauncher, LocalizedString, WindowDesc};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn wasm_main() {
    // This hook is necessary to get panic messages in the console
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
    run()
}

pub fn run() {
    let main_window = WindowDesc::new(app::ui_builder)
        .title(LocalizedString::new("app-window-title").with_placeholder("Ovrt Druid Example"));
    // Set our initial data
    let data = AppData::default();
    let app = AppLauncher::with_window(main_window);
    let delegate = Delegate {
        eventsink: sink::druid_global_event_sink(Some(&app)).clone(),
    };
    app.delegate(delegate)
        .use_simple_logger()
        .launch(data)
        .expect("launch failed");
}
