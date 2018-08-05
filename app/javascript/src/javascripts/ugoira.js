import { ZipImagePlayer } from '../../vendor/pixiv-ugoira-player';
require("jquery-ui/ui/widgets/progressbar");
require("jquery-ui/ui/widgets/slider");

let Ugoira = {};

Ugoira.create_player = (mime_type, frames, file_url) => {
  var meta_data = {
    mime_type: mime_type,
    frames: frames
  };
  var options = {
    canvas: $("#image")[0],
    source: file_url,
    metadata: meta_data,
    chunkSize: 300000,
    loop: true,
    autoStart: true,
    debug: false,
  }

  Ugoira.player = new ZipImagePlayer(options);
  Ugoira.player_manually_paused = false;

  $(Ugoira.player).on("loadProgress", (ev, progress) => {
    $("#seek-slider").progressbar("value", Math.floor(progress * 100));
  });

  $("#ugoira-play").click(e => {
    Ugoira.player.play();
    $(this).hide();
    $("#ugoira-pause").show();
    Ugoira.player_manually_paused = false;
    e.preventDefault();
  })

  $("#ugoira-pause").click(e => {
    Ugoira.player.pause();
    $(this).hide();
    $("#ugoira-play").show();
    Ugoira.player_manually_paused = true;
    e.preventDefault();
  });

  $("#seek-slider").progressbar({
    value: 0
  });

  $("#seek-slider").slider({
    min: 0,
    max: Ugoira.player._frameCount-1,
    start: (event, ui) => {
      // Need to pause while slider is being dragged or playback speed will bug out
      Ugoira.player.pause();
    },
    slide: (event, ui) => {
      Ugoira.player._frame = ui.value;
      Ugoira.player._displayFrame();
    },
    stop: (event, ui) => {
      // Resume playback when dragging stops, but only if player was not paused by the user earlier
      if (!(Ugoira.player_manually_paused)) {
        Ugoira.player.play();
      }
    }
  });

  $(Ugoira.player).on("frame", (frame, frame_number) => {
    console.log("frame", frame_number);
    $("#seek-slider").slider("option", "value", frame_number);
  });
}

export default Ugoira;

