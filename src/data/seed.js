export const CATEGORIES = ['Design', 'Travel', 'Food', 'Tech', 'Photography', 'Fitness'];

export const REPLIES = [
  'That makes sense. Let me think about it and get back to you.',
  'Thanks for sharing this, really helpful.',
  'Sounds good to me. Shall we talk properly tomorrow?',
  'Haha, exactly what I was thinking.',
  'Nice one. Send me the details when you get a chance.',
  'I will check and let you know this evening.',
];

const av = (n) => `https://i.pravatar.cc/300?img=${n}`;
const cv = (s) => `https://picsum.photos/seed/${s}/1400/500`;
const pic = (s) => `https://picsum.photos/seed/${s}/900/700`;
const tall = (s) => `https://picsum.photos/seed/${s}/720/1280`;

export function buildSeed() {
  const now = Date.now();
  const ago = (min) => now - min * 60000;
  const base = (o) => ({
    bio: '', location: '', website: '', private: false, showActivity: true, allowMessages: true,
    followingIds: [], bookmarks: [], requested: [], demo: true, followingBase: 0, ...o,
  });

  const users = [
    base({ id: 'me', name: 'Aditya Rao', username: 'aditya.rao', bio: 'B.Tech student. Building things for the web and photographing the places I pass through on my commute.', location: 'Pune, India', website: 'adityarao.dev', avatar: av(12), cover: cv('nexora-me'), followersBase: 128, joined: ago(60 * 24 * 200), followingIds: ['u1', 'u2', 'u4', 'u8', 'u10', 'u11'], bookmarks: ['p3', 'p9'] }),
    base({ id: 'u1', name: 'Aarav Mehta', username: 'aarav.mehta', bio: 'Product designer. Design systems, quiet interfaces, strong coffee.', location: 'Mumbai, India', website: 'aarav.design', avatar: av(33), cover: cv('aarav'), followersBase: 2340, followingBase: 312, joined: ago(60 * 24 * 700) }),
    base({ id: 'u2', name: 'Sofia Alvarez', username: 'sofia.alvarez', bio: 'Travel photographer based in Lisbon. Chasing early light and empty streets.', location: 'Lisbon, Portugal', website: 'sofiaalvarez.photo', avatar: av(47), cover: cv('sofia'), followersBase: 8120, followingBase: 410, joined: ago(60 * 24 * 900) }),
    base({ id: 'u3', name: 'Kenji Tanaka', username: 'kenji.tanaka', bio: 'Ramen cook. Slow broth, honest ingredients.', location: 'Osaka, Japan', website: '', avatar: av(15), cover: cv('kenji'), followersBase: 1580, followingBase: 190, joined: ago(60 * 24 * 450) }),
    base({ id: 'u4', name: 'Priya Nair', username: 'priya.nair', bio: 'Machine learning engineer. Writing about data, models and the messy middle.', location: 'Bengaluru, India', website: 'priyanair.dev', avatar: av(45), cover: cv('priya'), followersBase: 4210, followingBase: 280, joined: ago(60 * 24 * 600) }),
    base({ id: 'u5', name: 'Marcus Bell', username: 'marcus.bell', bio: 'Strength coach. Consistency over intensity.', location: 'Austin, USA', website: '', avatar: av(59), cover: cv('marcus'), followersBase: 3090, followingBase: 150, joined: ago(60 * 24 * 520) }),
    base({ id: 'u6', name: 'Lena Fischer', username: 'lena.fischer', bio: 'Architect working with timber and daylight.', location: 'Berlin, Germany', website: '', avatar: av(26), cover: cv('lena'), followersBase: 1760, followingBase: 220, private: true, joined: ago(60 * 24 * 380) }),
    base({ id: 'u7', name: 'Omar Haddad', username: 'omar.haddad', bio: 'Chef and market regular. Cooking what the season offers.', location: 'Beirut, Lebanon', website: '', avatar: av(52), cover: cv('omar'), followersBase: 2650, followingBase: 330, joined: ago(60 * 24 * 410) }),
    base({ id: 'u8', name: 'Isha Kapoor', username: 'isha.kapoor', bio: 'Illustrator. Posters, book covers, and too many pencils.', location: 'Mumbai, India', website: 'ishakapoor.art', avatar: av(5), cover: cv('isha'), followersBase: 5340, followingBase: 360, joined: ago(60 * 24 * 760) }),
    base({ id: 'u9', name: 'Tomas Novak', username: 'tomas.novak', bio: 'Long-distance cyclist. Mountains, maps and bad weather.', location: 'Prague, Czechia', website: '', avatar: av(60), cover: cv('tomas'), followersBase: 980, followingBase: 140, joined: ago(60 * 24 * 300) }),
    base({ id: 'u10', name: 'Zoe Chen', username: 'zoe.chen', bio: 'Frontend developer. Accessible interfaces and tidy state.', location: 'Vancouver, Canada', website: 'zoechen.dev', avatar: av(9), cover: cv('zoe'), followersBase: 3720, followingBase: 240, joined: ago(60 * 24 * 640) }),
    base({ id: 'u11', name: 'David Okafor', username: 'david.okafor', bio: 'Street photographer. 35mm and patience.', location: 'Lagos, Nigeria', website: 'davidokafor.photo', avatar: av(68), cover: cv('david'), followersBase: 6410, followingBase: 520, joined: ago(60 * 24 * 820) }),
    base({ id: 'u12', name: 'Hana Sato', username: 'hana.sato', bio: 'Ceramicist. Ash glazes and imperfect bowls.', location: 'Kyoto, Japan', website: '', avatar: av(44), cover: cv('hana'), followersBase: 2120, followingBase: 170, joined: ago(60 * 24 * 340) }),
  ];

  const c = (id, userId, text, min) => ({ id, userId, text, createdAt: ago(min) });
  const post = (id, userId, text, image, category, min, likes, comments = [], shares = 0) => ({ id, userId, text, image, category, createdAt: ago(min), likes, comments, shares });

  const posts = [
    post('p1', 'u1', 'Spent the weekend rebuilding our design tokens from scratch. Fewer colors, clearer rules, and the whole system feels calmer. Sometimes subtraction is the feature. #design #systems', pic('desk1'), 'Design', 40, ['u8', 'u10', 'me', 'u12'], [c('c1', 'u8', 'This is the kind of cleanup every team needs.', 22)], 2),
    post('p2', 'u2', 'Golden hour over the Alfama rooftops. I climbed 200 stairs for this and would do it again tomorrow. #lisbon #travel', pic('alfama'), 'Travel', 95, ['u1', 'u9', 'u11', 'me', 'u4', 'u7'], [c('c2', 'u9', 'Worth every step. Adding it to my list.', 60), c('c3', 'u11', 'The light on those tiles is unreal.', 41)], 4),
    post('p3', 'u3', 'Tonkotsu broth, day two. Twelve hours of simmering and the kitchen finally smells like a proper ramen shop. #ramen #food', pic('ramen'), 'Food', 180, ['u7', 'me', 'u2'], [c('c4', 'u7', 'Patience is the secret ingredient.', 120)], 1),
    post('p4', 'u4', 'Reminder that a model with 92% accuracy on a clean test set can still fail in production. Always check for data drift before you celebrate. #machinelearning #tech', '', 'Tech', 300, ['u10', 'me', 'u1', 'u5', 'u8'], [c('c5', 'u10', 'Monitoring is half the model.', 250)], 6),
    post('p5', 'u5', 'Five weeks of consistent 6 a.m. sessions. No new program, no secret trick, just showing up. Strength follows consistency. #fitness #strength', pic('gym5'), 'Fitness', 420, ['u9', 'u3', 'me'], [], 0),
    post('p6', 'u6', 'Visited the new timber library on the river. The way light moves through the slatted facade is worth the trip alone. #architecture #design', pic('library6'), 'Design', 540, ['u1', 'u12', 'u8'], [], 1),
    post('p7', 'u7', "Saturday market haul: figs, sumac, and the last of the season's tomatoes. Tonight's menu is basically writing itself. #food #cooking", pic('market7'), 'Food', 720, ['u3', 'u2', 'u4', 'me'], [c('c6', 'u3', 'Those figs look perfect.', 650)], 2),
    post('p8', 'u8', "Finished the poster series for the city's book festival. Four weeks, three revisions, one very tired wrist. #illustration #design", pic('poster8'), 'Design', 900, ['u1', 'u12', 'u10', 'me', 'u6'], [c('c7', 'u12', 'The color choices are beautiful.', 800), c('c8', 'u1', 'Brilliant series. Congratulations.', 760)], 5),
    post('p9', 'u9', 'Crossed the Tatra mountains by bike today, 112 km and a lot of climbing. The descent into the valley made every minute of the ascent worthwhile. #cycling #travel', pic('tatra9'), 'Travel', 1200, ['u5', 'u2', 'me'], [], 1),
    post('p10', 'u10', 'Hot take: most UI bugs are really state bugs. Name your states before you write your components. #frontend #react #tech', '', 'Tech', 1440, ['u4', 'me', 'u1', 'u8'], [c('c9', 'u4', 'Draw the state machine first. Saves hours.', 1300)], 3),
    post('p11', 'u11', 'Lagos at dusk, shot on a 35mm prime from a pedestrian bridge. Wait long enough and the street composes the frame for you. #streetphotography', pic('lagos11'), 'Photography', 1560, ['u2', 'u9', 'me', 'u1'], [], 2),
    post('p12', 'u12', 'New batch out of the kiln. The ash glaze did something unexpected on the rim and I am not complaining. #ceramics #handmade', pic('kiln12'), 'Design', 2880, ['u8', 'u6', 'u3'], [], 0),
    post('p13', 'me', 'Finally got my semester project running end to end. Fifteen routes, one very long README, and no console errors. #frontend #college', '', 'Tech', 2900, ['u10', 'u4', 'u8'], [c('c10', 'u10', 'Clean structure. How did you handle the route guards?', 40), c('c11', 'u4', 'Congratulations! Ship it.', 2800)], 0),
    post('p14', 'u2', 'Tram 28 before the tourists wake up. Early mornings are the cheapest travel upgrade. #lisbon #photography', pic('tram14'), 'Photography', 4300, ['u11', 'me', 'u9'], [], 1),
    post('p15', 'u4', 'Wrote my first technical talk this week. Eight slides, one demo, and a great deal of nervous energy. Any advice from people who speak often?', '', 'Tech', 4400, ['u10', 'u1'], [c('c12', 'u1', 'Rehearse the first minute until it is automatic. The rest follows.', 4300), c('c13', 'u10', 'Keep the demo short and have a recording as backup.', 4200)], 0),
    post('p16', 'u5', 'Rest days are training days. Sleep, eat, walk, repeat. #fitness', '', 'Fitness', 5800, ['u9', 'u3'], [], 0),
  ];

  const stories = [
    { id: 's1', userId: 'u1', image: tall('story-aarav-1'), createdAt: ago(120) },
    { id: 's2', userId: 'u1', image: tall('story-aarav-2'), createdAt: ago(90) },
    { id: 's3', userId: 'u2', image: tall('story-sofia-1'), createdAt: ago(200) },
    { id: 's4', userId: 'u4', image: tall('story-priya-1'), createdAt: ago(300) },
    { id: 's5', userId: 'u8', image: tall('story-isha-1'), createdAt: ago(60) },
    { id: 's6', userId: 'u8', image: tall('story-isha-2'), createdAt: ago(45) },
    { id: 's7', userId: 'u10', image: tall('story-zoe-1'), createdAt: ago(400) },
    { id: 's8', userId: 'u11', image: tall('story-david-1'), createdAt: ago(500) },
  ];

  const m = (id, from, text, min) => ({ id, from, text, at: ago(min) });
  const conversations = [
    { id: 'c1', ownerId: 'me', userId: 'u1', unread: 2, messages: [m('m1', 'me', 'Hey Aarav, loved the token post. Do you have the palette file?', 180), m('m2', 'u1', 'Thanks! Sure, I will export it tonight.', 150), m('m3', 'u1', 'Also, are you free for a quick review of your project next week?', 12), m('m4', 'u1', 'No rush, just let me know.', 11)] },
    { id: 'c2', ownerId: 'me', userId: 'u2', unread: 0, messages: [m('m5', 'u2', 'Thanks for the kind words on the Alfama shot.', 1500), m('m6', 'me', 'It deserved them. Which lens was that?', 1450), m('m7', 'u2', 'A 35mm prime. Nothing fancy.', 1440)] },
    { id: 'c3', ownerId: 'me', userId: 'u4', unread: 1, messages: [m('m8', 'me', 'Your note on data drift was really useful for my seminar.', 3000), m('m9', 'u4', 'Glad it helped. Happy to share my slides if you want them.', 90)] },
    { id: 'c4', ownerId: 'me', userId: 'u10', unread: 0, messages: [m('m10', 'u10', 'Your routing question made me think. I will reply under the post.', 2000), m('m11', 'me', 'Thanks Zoe, appreciate it.', 1990)] },
  ];

  const n = (id, type, userId, min, extra = {}) => ({ id, ownerId: 'me', type, userId, at: ago(min), read: false, ...extra });
  const notifications = [
    n('n1', 'like', 'u2', 5, { postId: 'p13' }),
    n('n2', 'comment', 'u10', 40, { postId: 'p13', text: 'Clean structure. How did you handle the route guards?' }),
    n('n3', 'follow', 'u1', 180),
    n('n4', 'request', 'u9', 300, { status: 'pending' }),
    n('n5', 'like', 'u8', 1500, { postId: 'p13', read: true }),
    n('n6', 'follow', 'u11', 2900, { read: true }),
    n('n7', 'comment', 'u4', 2800, { postId: 'p13', text: 'Congratulations! Ship it.', read: true }),
  ];

  return {
    session: null,
    accounts: [{ userId: 'me', email: 'demo@nexora.app', password: 'Demo@1234' }],
    users, posts, stories, viewedStories: [], conversations, notifications, theme: 'light',
  };
}
