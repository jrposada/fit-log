# Change image during climb create

**Date:** 2026-06-12

## What to build

During climb creation the user picks a wall photo, then places holds and a spline
on it. Today, once an image is chosen there is no way to pick a different one —
the user is locked into their first choice until they abandon the screen. This
adds a **replace-image** affordance to the create flow so the photo can be
swapped before the climb is saved.

The locking is purely a UI gap, not a backend or data limitation:

- In `climb-detail-screen.tsx`, the "Select Image" button lives in the `else`
  branch of a ternary. As soon as `watchedImage` + `imageUri` are truthy, the
  branch flips to render `ClimbImage` and the button disappears with no
  replacement control.
- The picker flow itself already supports re-selection end to end: `handleSelectImage`
  navigates to the `ImagePicker` screen, and the `ImagePickerEvents` subscription
  in `use-climb-detail.tsx` uploads the new image and calls
  `setValue('image', savedImage.id)` — overwriting whatever was there. Picking a
  second image already replaces the first; the UI just never lets the user reach
  the picker a second time.

So the change is: **expose a re-pick affordance whenever an image is selected in
create mode, and correctly reset the image-relative annotations when the image
changes.**

### Scope

| In scope | Out of scope |
|----------|--------------|
| Replace image in **create mode** | Replacing the image in **edit mode** (existing climb) — possible follow-up |
| Clearing holds/spline/selection on replace | Multi-image support, image cropping changes |
| Confirmation before discarding placed annotations | Backend / data model changes |

### Affordance

A **"Change image"** control is reachable whenever `ClimbImage` is rendered in
create mode. It triggers the existing picker flow (the same path as the initial
"Select Image" button). Placement: an overlay control on the image rather than a
separate section, so it does not compete with the form fields below and stays
attached to the thing it changes. Exact visual treatment is left to
implementation, but it must not interfere with the tap-to-place-hold gestures the
image surface already handles.

### Behavior on replace

Holds and spline points are stored as **normalized (0–1) coordinates relative to
the chosen image** (`watchedHolds`, `watchedSpline`). They are meaningless on a
different photo, so replacing the image must reset them.

The contract:

1. User invokes "Change image".
2. If any holds or spline points exist, show a **confirmation alert** first
   (reuse the existing discard-changes Alert pattern in `use-climb-detail.tsx`).
   On cancel, nothing happens. On confirm, proceed.
3. If no holds/spline exist (the common case — user just picked the wrong photo),
   skip the confirmation and go straight to the picker.
4. Picker returns a new image → it is uploaded and set as before, **and**
   `holds`, `spline`, and `selection` are reset to empty.

Resetting is tied to a *successful* new selection: if the user opens the picker
and cancels out of it, the current image and annotations stay intact (the
`ImagePickerEvents` subscription only fires on a real pick).

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Where the affordance lives | Overlay control on `ClimbImage` | Keeps the action attached to the image; avoids a redundant section once an image exists |
| Holds/spline on replace | Clear them, confirm first if non-empty | Coordinates are image-relative and invalid on a new photo; confirmation prevents silent loss of placed work |
| Confirmation when no annotations | Skip it | The frequent case is correcting the photo immediately after picking, before placing anything — a prompt would be pure friction |
| Reuse picker flow | Yes — same `handleSelectImage` / `ImagePickerEvents` path | The flow already overwrites the image; only the entry point and reset are missing |
| Scope | Create mode only | Matches the request; edit-mode replacement carries extra risk around existing saved annotations and is deferred |
| New copy | `climbing.change_image` label + a clear-annotations confirmation message | Existing `select_image` / `uploading_image` keys stay for the empty state |

## Gotchas

- **`imageUri` derivation has two sources.** In `use-climb-detail.tsx`, `imageUri`
  resolves to `uploadedImageUri` first, then falls back to the existing climb's
  URL. In create mode only `uploadedImageUri` applies. On replace, the new upload
  updates `uploadedImageUri`, so the displayed image follows automatically — no
  extra wiring needed for the preview.
- **Reset must clear `selection` too.** `selection` is local screen state
  (`useState`), not part of the form. A stale selection points at a hold index
  that no longer exists after the reset and would drive the footer's
  move/resize controls against nothing.
- **`isDirty` already covers the new image.** `setValue` is called with
  `shouldDirty: true`, so replacing keeps the submit button correctly enabled —
  no change to `isSubmitDisabled` logic.
- **Don't reset inside the `ImagePickerEvents` subscription based on a flag.**
  The subscription is shared and fires for the initial pick too. Resetting
  holds/spline there unconditionally is harmless in create mode (they're already
  empty on first pick), but the confirmation must gate *navigation to the
  picker*, decided up front where the current holds count is known — not after
  the image returns.
- **Image upload is async and shows `uploading_image`.** While the replacement
  uploads, the previous image is still displayed and `isImageUploading` is true.
  Ensure the replace affordance is disabled during an in-flight upload, matching
  how the initial button disables itself.
