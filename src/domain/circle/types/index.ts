export type CircleType = 'BOOTH_B' | 'BOOTH_A' | '1_SPACE' | '4_SPACE' | '2_SPACE';

export type AttendingDay = 'SAT' | 'SUN';

export type SocialMediaKind = 'FACEBOOK' | 'TWITTER' | 'INSTAGRAM' | 'OTHER';

export type SocialMediaDetail = {
  kind: SocialMediaKind;
  url: string;
};

export type CircleId = string;

export type Rating = 'M' | 'PG' | 'GA';

export type DisplayConfig = {
  backgroundColor: string;
  borderColor: string;
  backgroundColorHover: string;
};

export type Circle = {
  id: CircleId;
  code: string;
  imageUrl: string | null;
  name: string;
  fandoms: string[];
  workTypes: string[];
  attendingDays: AttendingDay[];
  socialMedias: SocialMediaDetail[];
  rating: Rating;
  circleType: CircleType;
  rect: BoothRect;
  displayConfig: DisplayConfig;
  sampleWorks: string[];
};

type BoothRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  type:
    | 'VERTICAL'
    | 'HORIZONTAL'
    | 'SPECIAL_VERTICAL'
    | 'SPECIAL_HORIZONTAL'
    | 'A_Z_HORIZONTAL';
};

export type NormalizedCircles = {
  circles: Circle[];
  fandoms: string[];
};
