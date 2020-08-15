use druid::{
    im::Vector,
    widget::{Button, Either, Flex, Label, List, Scroll},
    Data, Lens, UnitPoint, Widget, WidgetExt,
};
use ovrt_sys::{self as sys, log};

#[derive(Debug, Clone, Default, Data, Lens)]
pub struct AppData {
    pub overlays: Vector<Overlay>,
}

#[derive(Debug, Clone, Data, PartialOrd, Ord, PartialEq, Eq)]
pub enum Overlay {
    Spawning,
    Live(#[data(same_fn = "PartialEq::eq")] sys::types::Uid),
    Closing(#[data(same_fn = "PartialEq::eq")] sys::types::Uid),
}

impl Overlay {
    pub fn is_alive(&self) -> bool {
        self.get_alive().is_some()
    }
    pub fn is_closing(&self) -> bool {
        self.get_closing().is_some()
    }
    pub fn get_alive(&self) -> Option<&sys::types::Uid> {
        match self {
            Self::Live(uid) => Some(uid),
            _ => None,
        }
    }
    pub fn get_closing(&self) -> Option<&sys::types::Uid> {
        match self {
            Self::Closing(uid) => Some(uid),
            _ => None,
        }
    }
}

pub fn ui_builder() -> impl Widget<AppData> {
    let mut root = Flex::column();

    let add_overlay_button = || {
        Button::new("Add Overlay").on_click(|_ctx, data: &mut AppData, _| {
            data.overlays.push_back(Overlay::Spawning);
            // https://github.com/swfsql/ovrt-sys/issues/5
            let _zero_uid = sys::api::spawn_overlay(&Default::default());
        })
    };

    root.add_child(add_overlay_button().fix_height(30.0).expand_width());

    // Overlay lifecycle label texts
    // Spawning.. / Overlay #n / Closing #n
    let ov_label = || {
        Label::new(|ov: &Overlay, _env: &_| {
            use Overlay::*;
            match ov {
                Spawning => "Spawning..".to_string(),
                Live(uid) => {
                    let x: sys::types::Uid = uid.clone();
                    format!("Overlay #{}", x.0)
                }
                Closing(uid) => format!("Closing #{}..", uid.0),
            }
        })
    };

    // options content for when ov is not yet/anymore alive
    let ov_options_not_alive = || Label::new("(Options disabled)");
    // options content for when ov is alive
    let ov_another_button = || {
        Button::new("Into Twitch").on_click(|_ctx, ov: &mut Overlay, _env| {
            // safe unwrap because of the relation between is_alive and get_alive
            let uid = ov.get_alive().unwrap().clone();
            let username = "swfsql";
            let mut contents = sys::types::OVRWebContents::default();
            contents.width = 400;
            contents.height = 500;
            *contents.url_mut() = format!("https://www.twitch.tv/popout/{}/chat?popout=", username);
            log!("before calling set_contents");
            sys::api::set_contents_website(uid, &contents);
            log!("after calling set_contents");
        })
    };
    let ov_delete_button = || {
        Button::new("Delete").on_click(|_ctx, ov: &mut Overlay, _env| {
            // safe unwrap because of the relation between is_alive and get_alive
            let uid = ov.get_alive().unwrap().clone();
            *ov = Overlay::Closing(uid.clone());
            sys::api::close_overlay(uid);
        })
    };
    let ov_options_alive = move || {
        Flex::column()
            .with_child(Label::new("(Stuff 1)"))
            .with_child(Label::new("(Stuff 2)"))
            .with_child(
                ov_another_button()
                    .fix_size(80.0, 20.0)
                    .align_vertical(UnitPoint::CENTER),
            )
            .with_child(
                ov_delete_button()
                    .fix_size(80.0, 20.0)
                    .align_vertical(UnitPoint::CENTER),
            )
    };

    let ov_list = List::new(move || {
        Flex::row()
            // lensed to AppData::overlays
            .with_child(ov_label())
            // .with_child(Label::new(label_text))
            .with_flex_spacer(1.0)
            .with_child(Either::new(
                |ov: &Overlay, _env| ov.is_alive(),
                ov_options_alive(),
                ov_options_not_alive(),
            ))
        // .padding(10.0)
        // .background(Color::rgb(0.5, 0.0, 0.5))
        // .fix_height(50.0)
    });
    let ov_list = Scroll::new(ov_list)
        .vertical()
        .lens(AppData::overlays)
        // .lens(lens::Id.map(
        //     // Expose shared data with children data
        //     |d: &AppData| (d.right.clone(), d.right.clone()),
        //     |d: &mut AppData, x: (Vector<u32>, Vector<u32>)| {
        //         // If shared data was changed reflect the changes in our AppData
        //         d.right = x.0
        //     },
        // )),
        ;
    let mut ov_flex_list = Flex::row();
    ov_flex_list.add_flex_child(ov_list, 1.0);

    root.add_flex_child(ov_flex_list, 1.0);

    // Mark the widget as needing its layout rects painted
    // root.debug_paint_layout()
    root
}
