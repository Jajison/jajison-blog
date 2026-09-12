import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { frameRegistry } from "./quartz/components/frames"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes/dispatcher"
import {
  TutorialFrame,
  TutorialBrand,
  TutorialNav,
  CourseNav,
  CourseMeta,
  TutorialFooter,
} from "./quartz/components/Tutorial"
import { TutorialDownloads, TutorialReading } from "./quartz/plugins/tutorial"

const config = await loadQuartzConfig()
const loaded = await loadQuartzLayout()
frameRegistry.register("tutorial", TutorialFrame, "jajison-blog")
const defaults = {
  ...loaded.defaults,
  header: [TutorialBrand, TutorialNav, ...(loaded.defaults.header ?? [])],
  beforeBody: [CourseMeta],
  left: [CourseNav],
  footer: [TutorialFooter],
}
export const layout = {
  defaults,
  byPageType: Object.fromEntries(
    ["content", "folder", "tag", "404"].map((type) => [
      type,
      {
        ...defaults,
        frame: "tutorial",
        right: type === "content" ? defaults.right : [],
      },
    ]),
  ),
}
config.plugins.transformers.push(TutorialReading())
config.plugins.emitters = config.plugins.emitters.filter(
  (emitter) => emitter.name !== "PageTypeDispatcher",
)
config.plugins.emitters.push(TutorialDownloads(), PageTypeDispatcher(layout))
export default config
