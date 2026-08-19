/**
 * Ảnh trang chủ lấy từ thư mục assets/assest
 */
import hero from './assest/2aoboqo02ptxs4i9fvmogok0odgmsojqsjdlmtw02.jpg';
import coreValues from './assest/2aoboqo03bgamrzfkyqzedepmdkxh5zg1jzmmetk21.jpg';
import reception from './assest/2aoboqo02revdlwst8atsqgza5uvzeiwrtpo6jhi5.jpg';
import rehabTherapy from './assest/2aoboqo02pcrc8fi1aoxpfqk95fsoro9vitw2m401.jpg';
import outdoorCare from './assest/2aoboqo02qv3rysys0x1gd1czbp4efarhvh9rimq3.jpg';
import hallwayWalk from './assest/2aoboqo03c3uzf9l2z6hjuikw2lkcqx236kfm7hs22.jpg';
import bedroomCare from './assest/2aoboqo03ceuw35ehnkqll74tk8tsj4kemyv3zem23.jpg';
import diningServe from './assest/2aoboqo03dgwtfqjzhu3c53ct1puqvnhw9tliknc24.jpg';
import communalDining from './assest/2aoboqo03dtoqscfgmtgsp61ivfxict4epxuue0g25.jpg';
import exerciseBike from './assest/2aoboqo0pmabte4x7ntlvzkdpdqdjgpdf1morhcy44.jpg';
import sharedRoom from './assest/2aoboqo02sifs5mtmu0pzrndabdj7iuogdfbterw6.jpg';
import privateRoom from './assest/2aoboqo0oafzpfvwchpdstsr8ggqpq3qn4z9boqo60.jpg';

export const homeImages = {
  hero,
  coreValues,
  reception,
  rehabTherapy,
  outdoorCare,
  hallwayWalk,
  bedroomCare,
  diningServe,
  communalDining,
  exerciseBike,
  sharedRoom,
  privateRoom,
  /** Fallback ảnh bài viết khi không có ảnh đại diện */
  postFallback: sharedRoom,
  /** Fallback ảnh sự kiện khi không có ảnh đại diện */
  eventFallback: communalDining,
  /** Avatar testimonials */
  testimonialAvatars: [hallwayWalk, outdoorCare, bedroomCare],
  /** Ảnh featured + danh sách chuyên gia */
  expertFeatured: reception,
  expertCards: [diningServe, rehabTherapy, exerciseBike, hallwayWalk],
};

export default homeImages;
