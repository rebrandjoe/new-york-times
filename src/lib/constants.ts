/** Single source of truth for Joseph's profile photo — used on /about and
 * on every article's author block, so updating one image updates both. */
export const AUTHOR_PHOTO_SRC = "/images/joseph-mmwa.jpg";
export const AUTHOR_PHOTO_ALT = "Portrait of Joseph Mmwa, Health & Medical Journalist";

/** The only account allowed into /admin — shared by the server-side guard
 * and the client-side header so the "Admin" link only ever shows for Joseph. */
export const ADMIN_EMAIL = "mmwajoseph@gmail.com";
