/**
 * Shared schedule for the scrubbed pinned sections, in units of one
 * item — the timeline is `count` units long, so timeline time and the
 * item index share a scale.
 *
 * Kept in one place because two things have to agree on it: the
 * timeline that animates the hand-offs, and the click target that
 * scrolls to an item. When they disagreed, clicking the first item
 * landed inside a hand-off and left it frozen half open.
 */

/** Static stretch before the first hand-off. Short on purpose: a long
 *  motionless run right after the pin engages reads as the page jamming. */
export const LEAD_IN = 0.25;

/** How long one item takes to give way to the next. */
export const HAND_OFF = 0.95;

/** Static stretch between hand-offs, so an item can be read. */
export const DWELL = 0.3;

/** Timeline time at which item `index` starts giving way to `index + 1`. */
export function handOffStart(index: number) {
  return LEAD_IN + index * (HAND_OFF + DWELL);
}

/**
 * Progress (0..1) at the middle of the window where `index` is fully
 * open — where a click should land.
 *
 * The obvious `(index + 0.5) / count` assumes each item owns the zone
 * `[i, i + 1)` with the item centred in it. That was true before the
 * hand-offs were scheduled independently; now the first item is only
 * whole for `[0, LEAD_IN]`, and that formula drops the click right in
 * the middle of its hand-off.
 */
export function restProgress(index: number, count: number) {
  const start = index === 0 ? 0 : handOffStart(index - 1) + HAND_OFF;
  const end = index === count - 1 ? count : handOffStart(index);

  return (start + end) / 2 / count;
}
