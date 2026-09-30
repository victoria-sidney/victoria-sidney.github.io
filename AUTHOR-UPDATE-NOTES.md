# Author pages — draft, not ready to publish

This branch preserves the published site and prepares the requested author pages.
Do not merge until the latest original covers and screenshot mockups can be opened and checked.
The execution workspace was unavailable when this draft was prepared.

## Prepared

- Five separate bilingual pages; homepage contains compact navigation only.
- Exact new Ukrainian author heading and a corresponding English translation.
- Smaller hero collection buttons; existing hero artwork and text preserved.
- Collection links select `?lang=uk#books` or `?lang=en#books`.
- All 12 existing book cards and their supplied links retained; five editions added.
- Ukrainian catalogue: 10 cards. English catalogue: 7 cards.
- Full vampire trilogy identified as one volume; three separate books identified without inventing a volume order.
- New texts cleaned of editing notes and HTML escapes. Five confirmed biographical facts retained.
- Supplied counts: 19 distinct published books / 26 editions.
- No Amazon link invented. Coming-soon items are plain status text.

## Blocking completion items

1. Open the latest two screenshot attachments. Compare button wording and placement; the current short descriptions are based on the supplied text because the mockup could not be inspected.
2. Open and copy the latest ten original covers listed below to their destination paths. None has been imported yet.
3. Replace each `[data-pending-cover]` slot in `index.html` and `start-reading.html` with an image using the destination path. Remove `cover-pending` from new slots. Old covers remain temporarily in five slots; new editions have title-only placeholders, not invented covers.
4. Confirm titles/capitalization against those covers.
5. Preview at desktop and mobile widths; check that the long author heading, compact buttons and new pages fit. Test both languages, direct collection links, browser Back, Amazon destinations, missing-link statuses and existing video playback.
6. Only after those steps, publish the completed update.

## Latest attachment mapping

| Photo | Latest attachment | Language | Destination | Amazon / status |
| --- | --- | --- | --- | --- |
| 3 | Gifted Christmas (1).png | en | `assets/covers/author-update/christmas-en.png` | https://www.amazon.com/dp/B0CNS85YHK |
| 4 | I'm a Vampire(1).png | en | `assets/covers/author-update/vampire-en.png` | Link coming soon |
| 5 | Planet Skywater(1).png | en | `assets/covers/author-update/skywater-en.png` | Link coming soon |
| 6 | В обіймах темряви(4).png | uk | `assets/covers/author-update/dark-embrace-uk.png` | https://www.amazon.com/dp/B0DFBX4FD6 |
| 7 | Кролик та Робін(1).jpg | uk | `assets/covers/author-update/rabbit-robin-uk.jpg` | Link coming soon |
| 8 | Маленький, гарненький вбивця(2).png | uk | `assets/covers/author-update/little-killer-uk.png` | https://www.amazon.com/dp/B0DFCFCTCH |
| 9 | Планета Скайвотер(1).png | uk | `assets/covers/author-update/skywater-uk.png` | https://www.amazon.com/dp/B0HGFF97QY |
| 10 | Подароване Різдво та шоколадне  бажання(1).png | uk | `assets/covers/author-update/christmas-uk.png` | https://www.amazon.com/dp/B0G9RGBDL9 |
| 11 | Прозорий світанок(6).png | uk | `assets/covers/author-update/clear-dawn-uk.png` | https://www.amazon.com/dp/B0DFC5DHPD |
| 12 | Я вампір(2).png | uk | `assets/covers/author-update/vampire-uk.png` | https://www.amazon.com/dp/B0DFC36HVN |

This mapping follows the user's attachment order and URLs. Amazon product metadata has not been independently verified.

## Verification performed

Static JavaScript parsing, preservation checks for untouched homepage sections and existing book links, expected catalogue counts, internal page/asset link checks, and language-selection checks using a minimal DOM mock. These are not a substitute for browser rendering checks. See the pull request for any verification limitations.
