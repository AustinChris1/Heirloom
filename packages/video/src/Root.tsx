import { Composition } from "remotion";
import { Closing } from "./Closing";
import { Lifecycle } from "./Lifecycle";
import { Title } from "./Title";
import { FPS } from "./theme";

/**
 * Segments for the submission video.
 *
 * Deliberately separate compositions rather than one timeline: these are cut
 * against screen-recorded footage in an editor, so each needs to render as its
 * own file. Nothing here narrates or explains — the recording does that. These
 * cover the parts a screen recording is bad at: a title that sets the premise,
 * the four-stage model held still long enough to read, and a closing slate of
 * verifiable facts.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Title"
      component={Title}
      durationInFrames={FPS * 6}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Lifecycle"
      component={Lifecycle}
      durationInFrames={FPS * 12}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Closing"
      component={Closing}
      durationInFrames={FPS * 7}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
