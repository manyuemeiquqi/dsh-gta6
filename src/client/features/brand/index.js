/**
 * Brand marks.
 *
 * The hero mark (`conversation.hero.brand.mark`) is a root-scoped single slot,
 * but registering into it at plugin-apply time races the conversation entry that
 * declares it: when that entry has not declared the slot yet, the registration
 * throws and takes the whole plugin down with it. The hero mark is hidden by the
 * headline banner anyway, so the theme does not register there.
 *
 * The sidebar marks (`sidebar.brand.mark` / `sidebar.brand.name`) are already
 * occupied by the official brand plugin — a single slot keeps its first
 * registrant — so both are restyled in `styles.css` instead.
 *
 * Nothing here can fail the plugin: every registration is optional and guarded.
 */

export function registerBrandMark() {
  return () => {}
}
